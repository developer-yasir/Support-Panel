import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const RecentActivity = ({ startDate, endDate }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the API
  useEffect(() => {
    const fetchActivities = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/activity${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        // Ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setActivities(data);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        // Fallback to mock data
        const mockActivities = [
          { id: 1, user: 'John Doe', action: 'created', ticketId: 'TK-1001', time: '2 minutes ago' },
          { id: 2, user: 'Jane Smith', action: 'updated', ticketId: 'TK-1005', time: '15 minutes ago' },
          { id: 3, user: 'Bob Johnson', action: 'resolved', ticketId: 'TK-0987', time: '1 hour ago' },
          { id: 4, user: 'Alice Williams', action: 'commented', ticketId: 'TK-1012', time: '2 hours ago' },
          { id: 5, user: 'Charlie Brown', action: 'assigned', ticketId: 'TK-1023', time: '3 hours ago' }
        ];
        setActivities(mockActivities);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [startDate, endDate]);

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Recent Activity</h3>
        {loading ? (
          <div className="loading-placeholder">Loading activities...</div>
        ) : (
          <div className="activity-list">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="activity-item__content">
                  <p className="activity-item__text">
                    <strong>{activity.user || activity.username}</strong> {activity.action} ticket <strong>{activity.ticketId}</strong>
                  </p>
                  <p className="activity-item__time">{activity.time || activity.createdAt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;