import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { api } from '../services/api';

const Overview = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    highPriorityTickets: 0
  });
  const [loading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await api.get('/tickets/stats');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch ticket statistics');
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'in_progress': return 'badge badge-warning';
      case 'resolved': return 'badge badge-info';
      case 'closed': return 'badge badge-secondary';
      default: return 'badge badge-secondary';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low': return 'badge badge-success';
      case 'medium': return 'badge badge-warning';
      case 'high': return 'badge badge-danger';
      case 'urgent': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Overview
                </h1>
                <p className="dashboard-header__subtitle">System overview and statistics</p>
              </div>
              <button
                onClick={() => navigate('/ticket/new')}
                className="btn btn--primary dashboard-header__create-btn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Ticket
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="dashboard__stats-grid">
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--total">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Total Tickets</p>
                      <h4 className="stats-card__value">
                        {loading ? (
                          <span>Loading...</span>
                        ) : (
                          stats.totalTickets
                        )}
                      </h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--primary" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--open">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Open Tickets</p>
                      <h4 className="stats-card__value">
                        {loading ? (
                          <span>Loading...</span>
                        ) : (
                          stats.openTickets
                        )}
                      </h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--success" style={{width: `${stats.totalTickets > 0 ? (stats.openTickets / stats.totalTickets) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--progress">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">In Progress</p>
                      <h4 className="stats-card__value">
                        {loading ? (
                          <span>Loading...</span>
                        ) : (
                          stats.inProgressTickets
                        )}
                      </h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--warning">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--warning" style={{width: `${stats.totalTickets > 0 ? (stats.inProgressTickets / stats.totalTickets) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--priority">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">High Priority</p>
                      <h4 className="stats-card__value">
                        {loading ? (
                          <span>Loading...</span>
                        ) : (
                          stats.highPriorityTickets
                        )}
                      </h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--danger">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--danger" style={{width: `${stats.totalTickets > 0 ? (stats.highPriorityTickets / stats.totalTickets) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Overview Content */}
          <div className="card overview-content-card">
            <div className="card__body">
              <h3 className="overview-content-card__title">System Overview</h3>
              <p className="overview-content-card__description">
                This dashboard provides an overview of your support ticket system. 
                You can view detailed ticket information in the <a href="/tickets" className="link">Tickets</a> section.
              </p>
              
              <div className="overview-content-card__stats-grid">
                <div className="overview-content-card__stat-item">
                  <div className="stat-item__icon-wrapper stat-item__icon-wrapper--info">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stat-item__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-item__content">
                    <h4 className="stat-item__title">Ticket Distribution</h4>
                    <p className="stat-item__value">
                      {stats.totalTickets > 0 
                        ? `${Math.round((stats.openTickets / stats.totalTickets) * 100)}% open tickets` 
                        : 'No tickets yet'}
                    </p>
                  </div>
                </div>
                
                <div className="overview-content-card__stat-item">
                  <div className="stat-item__icon-wrapper stat-item__icon-wrapper--warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stat-item__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="stat-item__content">
                    <h4 className="stat-item__title">Priority Tickets</h4>
                    <p className="stat-item__value">
                      {stats.totalTickets > 0 
                        ? `${Math.round((stats.highPriorityTickets / stats.totalTickets) * 100)}% high priority` 
                        : 'No tickets yet'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;