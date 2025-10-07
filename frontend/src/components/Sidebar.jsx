import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Add/remove collapsed class to body for layout adjustments
    if (isCollapsed) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
    
    return () => {
      document.body.classList.remove('sidebar-collapsed');
    };
  }, [isCollapsed]);

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/overview'
    },
    {
      id: 'tickets',
      title: 'Tickets',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/tickets'
    },
    {
      id: 'agents',
      title: 'Agents',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/agents'
    },
    {
      id: 'companies',
      title: 'Companies',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/companies'
    },
    {
      id: 'reports',
      title: 'Reports',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/reports'
    },
    {
      id: 'chat',
      title: 'Live Chat',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      path: '/chat'
    },
    {
      id: 'settings',
      title: 'Settings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings'
    }
  ];

  const isActive = (path) => {
    // Simple path comparison - since dashboard now points to /overview, just check for exact match
    return location.pathname === path;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'sidebar--collapsed' : ''}`}>
      <div className="sidebar__header">
        <button 
          className="sidebar-collapse-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="icon" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div className="sidebar__menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__menu-item ${isActive(item.path) ? 'sidebar__menu-item--active' : ''}`}
            onClick={() => navigate(item.path)}
            title={isCollapsed ? item.title : ''}
          >
            {item.icon}
            {!isCollapsed && <span className="sidebar__menu-text">{item.title}</span>}
          </button>
        ))}
        <div style={{ marginTop: 'auto' }}>
          <button
            className="sidebar__menu-item"
            onClick={logout}
            title={isCollapsed ? 'Logout' : ''}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="sidebar__menu-text">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;