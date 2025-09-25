import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/dashboard'
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
      id: 'contacts',
      title: 'Customers',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/contacts'
    },
    {
      id: 'companies',
      title: 'Organizations',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      path: '/companies'
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/knowledge-base'
    },
    {
      id: 'community',
      title: 'Community',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="icon sidebar__menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      path: '/community'
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

  const isActive = (path, id) => {
    // Dashboard route
    if (id === 'dashboard' && location.pathname === '/dashboard') return true;
    
    // Tickets routes
    if (id === 'tickets' && location.pathname === '/tickets') return true;
    
    // Contacts route
    if (id === 'contacts' && location.pathname === '/contacts') return true;
    
    // Companies route
    if (id === 'companies' && location.pathname === '/companies') return true;
    
    // Knowledge Base route
    if (id === 'knowledge-base' && location.pathname === '/knowledge-base') return true;
    
    // Community route
    if (id === 'community' && location.pathname === '/community') return true;
    
    // Reports route
    if (id === 'reports' && location.pathname === '/reports') return true;
    
    // Chat route
    if (id === 'chat' && location.pathname === '/chat') return true;
    
    // Settings route
    if (id === 'settings' && location.pathname === '/settings') return true;
    
    return false;
  };

  return (
    <div className="sidebar">
      <div className="sidebar__menu">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={`sidebar__menu-item ${isActive(item.path, item.id) ? 'sidebar__menu-item--active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
            <span className="sidebar__menu-text">{item.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;