import { useEffect } from 'react';

const LandingPage = () => {
  useEffect(() => {
    // Redirect to the static Next.js landing page
    window.location.replace('/index.html');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading landing page...</p>
      </div>
    </div>
  );
};

export default LandingPage; 