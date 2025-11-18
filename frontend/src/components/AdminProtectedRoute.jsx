import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AdminProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="modern-loading-screen">
        <div className="loading-wrapper">
          <div className="loading-content">
            <div className="loading-animation">
              <svg xmlns="http://www.w3.org/2000/svg" className="loading-app-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="loading-logo-container">
              <svg xmlns="http://www.w3.org/2000/svg" className="loading-app-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h1 className="loading-title">Support Panel</h1>
            <p className="loading-subtitle">Preparing your workspace</p>
            <div className="loading-progress-text">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  if (currentUser.role !== 'admin') {
    // Redirect to dashboard or show access denied page
    return <Navigate to="/tickets" />;
  }

  return children;
};

export default AdminProtectedRoute;