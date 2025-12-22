import { useSidebar } from '../contexts/SidebarContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
    const { isCollapsed } = useSidebar();

    return (
        <>
            <Sidebar />
            <Navbar />
            <main className={`pt-[100px] min-h-screen transition-all duration-300 ${isCollapsed ? 'ml-[116px]' : 'ml-[360px]'}`}>
                {children}
            </main>
        </>
    );
};

export default MainLayout;
