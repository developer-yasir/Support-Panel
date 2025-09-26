import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => {
  const navigate = useNavigate();

  // Set page title
  useEffect(() => {
    document.title = 'Support Panel';
  }, []);

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="dashboard__container">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;