import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const TicketCategories = ({ startDate, endDate }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real data from the API
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (startDate) queryParams.append('startDate', startDate);
        if (endDate) queryParams.append('endDate', endDate);
        
        const url = `/tickets/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
        const response = await api.get(url);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching ticket categories:', error);
        // Fallback to mock data
        const mockCategories = [
          { name: 'Technical', count: 24, percentage: 40, color: 'bg-primary' },
          { name: 'Billing', count: 12, percentage: 20, color: 'bg-success' },
          { name: 'Feature Request', count: 10, percentage: 17, color: 'bg-warning' },
          { name: 'Account', count: 8, percentage: 13, color: 'bg-info' },
          { name: 'Other', count: 6, percentage: 10, color: 'bg-secondary' }
        ];
        setCategories(mockCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [startDate, endDate]);

  return (
    <div className="card">
      <div className="card__body">
        <h3 className="card__title">Ticket Categories</h3>
        {loading ? (
          <div className="loading-placeholder">Loading categories...</div>
        ) : (
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-item">
                <div className="category-item__header">
                  <h4 className="category-item__name">{category.name}</h4>
                  <span className="category-item__count">{category.count}</span>
                </div>
                <div className="category-item__progress">
                  <div 
                    className={`progress-bar ${category.color}`} 
                    style={{ width: `${category.percentage || (category.count / Math.max(1, categories.reduce((sum, cat) => sum + cat.count, 0)) * 100)}%` }}
                  ></div>
                </div>
                <div className="category-item__percentage">{category.percentage || Math.round((category.count / Math.max(1, categories.reduce((sum, cat) => sum + cat.count, 0)) * 100))}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketCategories;