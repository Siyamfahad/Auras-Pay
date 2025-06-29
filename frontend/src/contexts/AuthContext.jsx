import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      console.log('LOGIN_SUCCESS: Setting user and token');
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case 'AUTH_ERROR':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('Checking auth, token exists:', !!token);
      
      if (token) {
        try {
          console.log('Making profile request...');
          const response = await authAPI.getProfile();
          console.log('Profile response received:', response.status);
          
          if (response.data && response.data.success && response.data.data && response.data.data.user) {
            console.log('Setting user from profile response');
            dispatch({ type: 'SET_USER', payload: response.data.data.user });
          } else {
            console.error('Invalid response format:', response.data);
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } catch (error) {
          console.error('Auth check failed:', error.response?.data || error.message);
          console.error('Error status:', error.response?.status);
          
          // Only clear auth if it's actually an auth error (401/403)
          if (error.response?.status === 401 || error.response?.status === 403) {
            console.log('Clearing auth due to 401/403');
            dispatch({ type: 'AUTH_ERROR' });
          } else {
            // For other errors (network, etc), keep the user logged in but stop loading
            console.log('Keeping auth due to non-auth error');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        }
      } else {
        console.log('No token found, setting loading to false');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    // Add a small delay before checking auth to ensure everything is initialized
    const timeoutId = setTimeout(checkAuth, 200);
    return () => clearTimeout(timeoutId);
  }, []);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login(email, password);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
      return response.data.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  const register = async (email, password, walletAddress = null) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(email, password, walletAddress);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.data.data });
      return response.data.data;
    } catch (error) {
      dispatch({ type: 'AUTH_ERROR' });
      throw error;
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (userData) => {
    dispatch({ type: 'SET_USER', payload: userData });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 