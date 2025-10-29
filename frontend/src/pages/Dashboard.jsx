import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the tickets page which serves as our main dashboard
    navigate('/tickets');
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="container dashboard__container">
        <div className="loading-placeholder">
          <div className="spinner spinner--primary"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;