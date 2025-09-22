import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container d-flex justify-content-between align-items-center">
        <a className="navbar-brand font-semibold d-flex align-items-center" href="/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Support Panel
        </a>
        
        <div className="d-flex align-items-center">
          <div className="me-4 d-flex align-items-center">
            <div className="bg-gray-200 rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '32px', height: '32px' }}>
              <span className="text-sm font-medium text-gray-700">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500">
                {user?.role === 'admin' ? 'Administrator' : 'Support Agent'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-sm btn-outline d-flex align-items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon me-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;