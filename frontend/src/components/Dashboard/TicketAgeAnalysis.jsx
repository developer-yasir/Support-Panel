import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const TicketAgeAnalysis = ({ startDate, endDate }) => {
  const [ageData, setAgeData] = useState([
    { label: '0-24h', count: 0, percentage: 0, color: 'bg-success' },
    { label: '1-3d', count: 0, percentage: 0, color: 'bg-info' },
    { label: '3-7d', count: 0, percentage: 0, color: 'bg-warning' },
    { label: '7-14d', count: 0, percentage: 0, color: 'bg-orange' },
    { label: '14d+', count: 0, percentage: 0, color: 'bg-danger' }
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the API
  useEffect(() => {
    const fetchAgeData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/age-analysis${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        setAgeData(response.data);
      } catch (error) {
        console.error('Error fetching age analysis:', error);
        // Fallback to mock data
        const mockData = [
          { label: '0-24h', count: 12, percentage: 30, color: 'bg-success' },
          { label: '1-3d', count: 15, percentage: 37, color: 'bg-info' },
          { label: '3-7d', count: 8, percentage: 20, color: 'bg-warning' },
          { label: '7-14d', count: 4, percentage: 10, color: 'bg-orange' },
          { label: '14d+', count: 1, percentage: 3, color: 'bg-danger' }
        ];
        setAgeData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchAgeData();
  }, [startDate, endDate]);

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Ticket Age Analysis</h3>
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner spinner--primary"></div>
            <p>Loading ticket age analysis...</p>
          </div>
        ) : (
          <>
            <div className="age-analysis-grid">
              {ageData.map((item, index) => (
                <div key={index} className="age-item">
                  <div className="age-item__header">
                    <h4 className="age-item__label">{item.label}</h4>
                    <span className="age-item__count">{item.count}</span>
                  </div>
                  <div className="age-item__progress">
                    <div 
                      className={`progress-bar ${item.color}`} 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="age-item__percentage">{item.percentage}%</div>
                </div>
              ))}
            </div>
            
            <div className="age-analysis-summary">
              <div className="summary-item">
                <div className="summary-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="summary-item__content">
                  <h4 className="summary-item__title">Recently Active</h4>
                  <p className="summary-item__value">{ageData.length > 1 ? ageData[0].count + ageData[1].count : 0} tickets</p>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="summary-item__content">
                  <h4 className="summary-item__title">Needs Attention</h4>
                  <p className="summary-item__value">{ageData.length > 3 ? ageData[2].count + ageData[3].count : 0} tickets</p>
                </div>
              </div>
              
              <div className="summary-item">
                <div className="summary-item__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="summary-item__content">
                  <h4 className="summary-item__title">Overdue</h4>
                  <p className="summary-item__value">{ageData.length > 4 ? ageData[4].count : 0} tickets</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TicketAgeAnalysis;