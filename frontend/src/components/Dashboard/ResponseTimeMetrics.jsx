import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ResponseTimeMetrics = ({ startDate, endDate }) => {
  const [metrics, setMetrics] = useState({
    avgFirstResponse: 0,
    avgResolutionTime: 0,
    targetResponseTime: 4,
    targetResolutionTime: 24
  });
  const [loading, setLoading] = useState(true);

  // Fetch real data from the API
  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/response-time${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        setMetrics(response.data);
      } catch (error) {
        console.error('Error fetching response time metrics:', error);
        // Fallback to mock data
        const mockMetrics = {
          avgFirstResponse: 3.2, // hours
          avgResolutionTime: 18.5, // hours
          targetResponseTime: 4, // hours
          targetResolutionTime: 24 // hours
        };
        setMetrics(mockMetrics);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [startDate, endDate]);

  // Calculate performance percentage
  const responsePerformance = Math.min(100, (metrics.avgFirstResponse / metrics.targetResponseTime) * 100);
  const resolutionPerformance = Math.min(100, (metrics.avgResolutionTime / metrics.targetResolutionTime) * 100);

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Response Time Metrics</h3>
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner spinner--primary"></div>
            <p>Loading response time metrics...</p>
          </div>
        ) : (
          <>
            <div className="metrics-grid">
              <div className="metric-item">
                <div className="metric-item__header">
                  <h4 className="metric-item__title">Avg. First Response</h4>
                  <span className="metric-item__time">{metrics.avgFirstResponse}h</span>
                </div>
                <div className="metric-item__progress">
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar ${responsePerformance < 75 ? 'progress-bar--success' : responsePerformance < 90 ? 'progress-bar--warning' : 'progress-bar--danger'}`} 
                      style={{ width: `${responsePerformance}%` }}
                    ></div>
                  </div>
                  <div className="progress-label">{Math.round(responsePerformance)}% of target</div>
                </div>
              </div>
              
              <div className="metric-item">
                <div className="metric-item__header">
                  <h4 className="metric-item__title">Avg. Resolution Time</h4>
                  <span className="metric-item__time">{metrics.avgResolutionTime}h</span>
                </div>
                <div className="metric-item__progress">
                  <div className="progress-bar-container">
                    <div 
                      className={`progress-bar ${resolutionPerformance < 75 ? 'progress-bar--success' : resolutionPerformance < 90 ? 'progress-bar--warning' : 'progress-bar--danger'}`} 
                      style={{ width: `${resolutionPerformance}%` }}
                    ></div>
                  </div>
                  <div className="progress-label">{Math.round(resolutionPerformance)}% of target</div>
                </div>
              </div>
            </div>
            
            <div className="metrics-targets">
              <div className="targets-item">
                <div className="targets-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="targets-item__content">
                  <h4 className="targets-item__title">Target Response Time</h4>
                  <p className="targets-item__value">{metrics.targetResponseTime} hours</p>
                </div>
              </div>
              
              <div className="targets-item">
                <div className="targets-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="targets-item__content">
                  <h4 className="targets-item__title">Target Resolution Time</h4>
                  <p className="targets-item__value">{metrics.targetResolutionTime} hours</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseTimeMetrics;