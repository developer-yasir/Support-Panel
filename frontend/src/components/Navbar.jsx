import { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuTimeoutRef = useRef(null);

  const handleMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setIsUserMenuOpen(true);
  };

  const handleMouseLeave = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setIsUserMenuOpen(false);
    }, 200); // Small delay to allow cursor movement to dropdown
  };

  const handleDropdownMouseEnter = () => {
    if (menuTimeoutRef.current) {
      clearTimeout(menuTimeoutRef.current);
    }
    setIsUserMenuOpen(true);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <div className="navbar__left">
          <div className="navbar__brand" onClick={() => navigate('/overview')} style={{display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'}}>
            <div className="logo-container" style={{width: '40px', height: '40px'}}>
              <div className="rotating-border" style={{width: '44px', height: '44px', borderRadius: '12px'}}></div>
              <div className="logo-aura" style={{width: '50px', height: '50px'}}></div>
              <div className="logo-aura logo-aura-2" style={{width: '55px', height: '55px'}}></div>
              <div className="logo-aura logo-aura-3" style={{width: '60px', height: '60px'}}></div>
              <div className="logo-icon" style={{width: '36px', height: '36px', borderRadius: '10px', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', color: 'white'}}>
                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{width: '18px', height: '18px'}}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
            </div>
            <span className="logo-text" style={{fontSize: '1.1rem', marginLeft: '8px'}}>INNOVENT SUPPORT PANEL</span>
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
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}>
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
              
              <div 
                className={`navbar__user-menu-dropdown ${isUserMenuOpen ? 'navbar__user-menu-dropdown--open' : ''}`}
                onMouseEnter={handleDropdownMouseEnter}
                onMouseLeave={() => setIsUserMenuOpen(false)}>
                <button className="navbar__user-menu-btn" onClick={() => navigate('/profile')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Manage Profile
                </button>
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