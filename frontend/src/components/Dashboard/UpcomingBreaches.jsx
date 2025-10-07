import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const UpcomingBreaches = ({ startDate, endDate }) => {
  const [breaches, setBreaches] = useState([
    { id: 'Loading...', title: 'Loading...', timeLeft: '...', priority: 'low', agent: '...' }
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the API
  useEffect(() => {
    const fetchBreaches = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/breaches${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        setBreaches(response.data);
      } catch (error) {
        console.error('Error fetching upcoming breaches:', error);
        // Fallback to mock data
        const mockBreaches = [
          { id: 'TK-1001', title: 'Server Down Issue', timeLeft: '15 min', priority: 'high', agent: 'John Doe' },
          { id: 'TK-1023', title: 'Payment Gateway Error', timeLeft: '45 min', priority: 'high', agent: 'Jane Smith' },
          { id: 'TK-1035', title: 'Login Issue', timeLeft: '2 hours', priority: 'medium', agent: 'Bob Johnson' },
          { id: 'TK-1041', title: 'Feature Request', timeLeft: '3 hours', priority: 'low', agent: 'Alice Williams' }
        ];
        setBreaches(mockBreaches);
      } finally {
        setLoading(false);
      }
    };

    fetchBreaches();
  }, [startDate, endDate]);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high': return 'badge badge-danger';
      case 'medium': return 'badge badge-warning';
      case 'low': return 'badge badge-success';
      default: return 'badge badge-secondary';
    }
  };

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Upcoming SLA Breaches</h3>
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner spinner--primary"></div>
            <p>Loading upcoming breaches...</p>
          </div>
        ) : (
          <div className="breaches-list">
            {breaches.map((breach, index) => (
              <div key={index} className="breach-item">
                <div className="breach-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="breach-item__content">
                  <div className="breach-item__header">
                    <span className="breach-item__id">{breach.id}</span>
                    <span className={getPriorityClass(breach.priority)}>{breach.priority}</span>
                  </div>
                  <h4 className="breach-item__title">{breach.title}</h4>
                  <div className="breach-item__meta">
                    <span className="breach-item__time">{breach.timeLeft} left</span>
                    <span className="breach-item__agent">Assigned to: {breach.agent}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpcomingBreaches;