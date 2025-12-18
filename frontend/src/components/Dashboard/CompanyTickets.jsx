import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const CompanyTickets = ({ startDate, endDate }) => {
  const [companyTickets, setCompanyTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch company ticket data from the API
  useEffect(() => {
    const fetchCompanyTickets = async () => {
      try {
        setLoading(true);
        
        // Query parameters for date range
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/company-stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        // Ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];
        setCompanyTickets(data);
      } catch (error) {
        console.error('Error fetching company ticket data:', error);
        
        // Fallback to mock data in case of API error
        const mockData = [
          {
            id: 1,
            companyName: 'Tech Solutions Inc.',
            opened: 24,
            inProgress: 12,
            resolved: 32,
            closed: 8
          },
          {
            id: 2,
            companyName: 'Global Enterprises',
            opened: 18,
            inProgress: 9,
            resolved: 26,
            closed: 6
          },
          {
            id: 3,
            companyName: 'Innovate Co.',
            opened: 15,
            inProgress: 7,
            resolved: 21,
            closed: 4
          },
          {
            id: 4,
            companyName: 'Digital Dynamics',
            opened: 12,
            inProgress: 5,
            resolved: 18,
            closed: 3
          },
          {
            id: 5,
            companyName: 'Cloud Services Ltd',
            opened: 9,
            inProgress: 4,
            resolved: 15,
            closed: 2
          }
        ];
        setCompanyTickets(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyTickets();
  }, [startDate, endDate]);

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Company Ticket Overview</h3>
        {loading ? (
          <div className="loading-placeholder">Loading company tickets...</div>
        ) : companyTickets.length === 0 ? (
          <div className="empty-state">
            <p>No company ticket data available</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table table--striped">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Opened</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                  <th>Closed</th>
                </tr>
              </thead>
              <tbody>
                {companyTickets.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div className="company-info-cell">
                        <div className="company-avatar">
                          {company.companyName?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <div className="company-details">
                          <div className="company-name">{company.companyName}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge--warning">{company.opened}</span>
                    </td>
                    <td>
                      <span className="badge badge--info">{company.inProgress}</span>
                    </td>
                    <td>
                      <span className="badge badge--success">{company.resolved}</span>
                    </td>
                    <td>
                      <span className="badge badge--secondary">{company.closed}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyTickets;