import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSidebar } from '../contexts/SidebarContext';
import { useResponsive } from '../hooks/useResponsive';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user: currentUser } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const { isMobile, isTablet } = useResponsive();

  const menuItems = [
    {
      id: 'overview',
      title: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      path: '/overview',
      allowedRoles: ['admin', 'support_agent', 'company_manager']
    },
    {
      id: 'tickets',
      title: 'Tickets',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      path: '/tickets',
      allowedRoles: ['admin', 'support_agent', 'company_manager']
    },
    ...(currentUser?.role === 'admin' || currentUser?.role === 'support_agent' || currentUser?.role === 'company_manager' ? [{
      id: 'agents',
      title: 'Agents',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      path: '/agents',
      allowedRoles: ['admin', 'support_agent', 'company_manager']
    }] : []),
    ...(currentUser?.role === 'admin' || currentUser?.role === 'company_manager' ? [{
      id: 'projects',
      title: 'Projects',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      path: '/projects',
      allowedRoles: ['admin', 'company_manager']
    }] : []),
    ...(currentUser?.role === 'admin' || currentUser?.role === 'support_agent' || currentUser?.role === 'company_manager' ? [{
      id: 'reports',
      title: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      path: '/reports',
      allowedRoles: ['admin', 'support_agent', 'company_manager']
    }] : []),
    {
      id: 'chat',
      title: 'Live Chat',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      path: '/chat',
      allowedRoles: ['admin', 'support_agent', 'company_manager']
    },
    ...(currentUser?.role === 'admin' || currentUser?.role === 'company_manager' ? [{
      id: 'users',
      title: 'Contacts',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      path: '/users',
      allowedRoles: ['admin', 'company_manager']
    }] : []),
    {
      id: 'settings',
      title: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      path: '/settings',
      allowedRoles: ['admin', 'support_agent', 'company_manager']
    },
    ...(currentUser?.role === 'admin' ? [{
      id: 'admin',
      title: 'Admin',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      path: '/admin',
      allowedRoles: ['admin']
    }] : [])
  ];

  const visibleMenuItems = menuItems.filter(item =>
    !item.allowedRoles || item.allowedRoles.includes(currentUser?.role)
  );

  const isActive = (path) => {
    if (path === '/tickets' && (location.pathname === '/' || location.pathname === '/tickets' || location.pathname === '/dashboard')) {
      return true;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Determine sidebar width based on screen size and collapse state
  const getSidebarClasses = () => {
    if (isMobile) {
      // Mobile: full overlay when open, hidden when closed
      return isCollapsed
        ? '-translate-x-full'
        : 'translate-x-0 w-[280px] shadow-2xl';
    } else {
      // Tablet/Desktop: normal behavior
      return `translate-x-0 ${isCollapsed ? 'w-16' : 'w-[260px]'}`;
    }
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed left-0 top-16 h-[calc(100vh-64px)] bg-gray-900 text-gray-300 
        transition-all duration-300 z-40
        ${getSidebarClasses()}
      `}>
        {/* Collapse Button Only - Logo is in navbar */}
        <div className="h-12 flex items-center justify-end px-4 border-b border-gray-800">
          <button
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-gray-800 rounded transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {visibleMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                if (isMobile) toggleSidebar(); // Close sidebar on mobile after navigation
              }}
              title={isCollapsed ? item.title : ''}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${isActive(item.path)
                ? 'bg-indigo-600 text-white border-l-4 border-indigo-400'
                : 'text-gray-300 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!isCollapsed && <span className="text-sm font-medium">{item.title}</span>}
            </button>
          ))}
        </nav>

        {/* Logout Button */}
        <div className="border-t border-gray-800 p-4">
          <button
            onClick={logout}
            title={isCollapsed ? 'Logout' : ''}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;