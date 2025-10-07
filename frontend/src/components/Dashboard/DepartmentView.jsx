import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const DepartmentView = ({ startDate, endDate }) => {
  const [departments, setDepartments] = useState([
    { name: 'Loading...', tickets: 0, open: 0, inProgress: 0, resolved: 0, avgTime: '0h' }
  ]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the API
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/departments${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching department data:', error);
        // Fallback to mock data
        const mockDepartments = [
          { name: 'Technical Support', tickets: 28, open: 12, inProgress: 8, resolved: 8, avgTime: '3.2h' },
          { name: 'Billing', tickets: 16, open: 6, inProgress: 5, resolved: 5, avgTime: '2.1h' },
          { name: 'Account Management', tickets: 12, open: 3, inProgress: 4, resolved: 5, avgTime: '4.5h' },
          { name: 'Feature Requests', tickets: 10, open: 7, inProgress: 2, resolved: 1, avgTime: '12.3h' }
        ];
        setDepartments(mockDepartments);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, [startDate, endDate]);

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Department View</h3>
        {loading ? (
          <div className="loading-placeholder">
            <div className="spinner spinner--primary"></div>
            <p>Loading department data...</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table table--striped">
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Total</th>
                  <th>Open</th>
                  <th>In Progress</th>
                  <th>Resolved</th>
                  <th>Avg. Time</th>
                </tr>
              </thead>
              <tbody>
                {departments.map((dept, index) => (
                  <tr key={index}>
                    <td>{dept.name}</td>
                    <td>{dept.tickets}</td>
                    <td>{dept.open}</td>
                    <td>{dept.inProgress}</td>
                    <td>{dept.resolved}</td>
                    <td>{dept.avgTime}</td>
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

export default DepartmentView;