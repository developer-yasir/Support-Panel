import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { useRoleAccess } from '../hooks/useRoleAccess';

const PermissionProtectedRoute = ({ children, requiredPermissions = [] }) => {
  const { user, loading } = useAuth();
  const { hasPermission } = useRoleAccess();

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
            <div className="loading-progress-text">Checking permissions...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Check if user has all required permissions
  if (requiredPermissions.length > 0) {
    const hasAllPermissions = requiredPermissions.every(permission => hasPermission(permission));
    if (!hasAllPermissions) {
      // Redirect to a permission denied page or home page
      return <Navigate to="/tickets" replace />;
    }
  }

  return children;
};

export default PermissionProtectedRoute;