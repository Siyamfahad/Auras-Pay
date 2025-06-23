import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) =>
    api.post('/api/auth/login', { email, password }),
  
  register: (email, password, walletAddress) =>
    api.post('/api/auth/register', { email, password, walletAddress }),
  
  getProfile: () =>
    api.get('/api/auth/me'),
  
  updateWallet: (walletAddress) =>
    api.put('/api/auth/wallet', { walletAddress }),
  
  generateApiKey: () =>
    api.post('/api/auth/generate-api-key'),
  
  getApiKeyInfo: () =>
    api.get('/api/auth/api-key-info'),
  
  revokeApiKey: () =>
    api.delete('/api/auth/revoke-api-key'),
};

// Payments API
export const paymentsAPI = {
  createPaymentLink: (data) =>
    api.post('/api/payments/payment-link', data),
  
  getPayments: (params = {}) =>
    api.get('/api/payments/payments', { params }),
  
  getPayment: (id) =>
    api.get(`/api/payments/payments/${id}`),
  
  getBalance: () =>
    api.get('/api/payments/balance'),
  
  getStats: () =>
    api.get('/api/payments/stats'),
};

// Credits API
export const creditsAPI = {
  purchaseCredits: (packageType) =>
    api.post('/api/purchase-credits', { package: packageType }),
};

// Admin API
export const adminAPI = {
  getUsers: (params = {}) =>
    api.get('/api/admin/users', { params }),
  
  adjustCredits: (userId, adjustment, reason) =>
    api.post('/api/admin/adjust-credits', { userId, adjustment, reason }),
  
  getAnalytics: () =>
    api.get('/api/admin/analytics'),
  
  getRecentActivity: () =>
    api.get('/api/admin/recent-activity'),
};

export default api; 