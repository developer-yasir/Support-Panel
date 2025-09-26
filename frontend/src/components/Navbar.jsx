import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <div className="navbar__brand" onClick={() => navigate('/overview')}>
            <span className="navbar__brand-text">SupportPanel</span>
          </div>
        </div>
        
        <div className="navbar__right">
          <div className="navbar__search">
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search tickets, customers..." 
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="navbar__search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="navbar__actions">
            <button className="btn btn--ghost navbar__action-btn">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="nav-badge">3</span>
            </button>
            
            <div className="navbar__user-menu"
                 onMouseEnter={() => setIsUserMenuOpen(true)}
                 onMouseLeave={() => setIsUserMenuOpen(false)}>
              <div className="navbar__user-info">
                <div className="navbar__user-avatar">
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
              
              <div className={`navbar__user-menu-dropdown ${isUserMenuOpen ? 'navbar__user-menu-dropdown--open' : ''}`}>
                <button className="navbar__user-menu-btn" onClick={handleLogout}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;