import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-container">
          <div className="loading-logo">
            <svg xmlns="http://www.w3.org/2000/svg" className="loading-logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h2 className="loading-title">Support Panel</h2>
          <p className="loading-subtitle">Loading your workspace...</p>
          <div className="loading-progress">
            <div className="loading-progress-bar">
              <div className="loading-progress-fill"></div>
            </div>
          </div>
          <div className="loading-spinner">
            <div className="spinner spinner--primary" style={{ width: '2rem', height: '2rem', borderWidth: '3px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;