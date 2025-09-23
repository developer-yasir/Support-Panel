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
      <div className="container navbar__container">
        <a className="navbar__brand" href="/dashboard">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon navbar__brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="navbar__brand-text">Support Panel</span>
        </a>
        
        <div className="navbar__user">
          <div className="navbar__user-info">
            <div className="navbar__user-avatar" style={{ width: '32px', height: '32px' }}>
              <span className="navbar__user-initial">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="navbar__user-details">
              <div className="navbar__user-name">
                {user?.name}
              </div>
              <div className="navbar__user-role">
                {user?.role === 'admin' ? 'Administrator' : 'Support Agent'}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn--outline btn--small navbar__logout-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon navbar__logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="navbar__logout-text">Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;