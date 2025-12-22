import { createContext, useContext, useState, useEffect } from 'react';

const SidebarContext = createContext();

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({ children }) => {
    // Initialize state from localStorage
    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebarCollapsed');
        return saved === 'true';
    });

    // Persist state to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    }, [isCollapsed]);

    const toggleSidebar = () => setIsCollapsed(prev => !prev);

    const value = {
        isCollapsed,
        toggleSidebar,
        sidebarWidth: isCollapsed ? 64 : 260 // 16 * 4 = 64px, 260px expanded
    };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};
