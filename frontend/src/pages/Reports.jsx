import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Charts from '../components/Charts'; // Reusing the existing Charts component

const Reports = () => {
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    resolvedTickets: 0,
    avgResponseTime: 0,
    avgResolutionTime: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('overview');
  const navigate = useNavigate();

  // Mock data for reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockStats = {
          totalTickets: 1245,
          openTickets: 189,
          resolvedTickets: 1056,
          avgResponseTime: 2.3, // hours
          avgResolutionTime: 18.5 // hours
        };
        setStats(mockStats);
      } catch (err) {
        setError('Failed to fetch reports data');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [startDate, endDate]);

  const handleDateRange = (range) => {
    const today = new Date();
    let start = new Date();
    
    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0);
        break;
      case 'week':
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        start = new Date(today.setDate(diff));
        start.setHours(0, 0, 0, 0);
        break;
      case 'month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarter':
        const quarter = Math.floor(today.getMonth() / 3);
        start = new Date(today.getFullYear(), quarter * 3, 1);
        break;
      default:
        return { startDate: '', endDate: '' };
    }
    
    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return (
    <div className="reports">
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
                  Reports & Analytics
                </h1>
                <p className="dashboard-header__subtitle">Analyze your support performance</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/export')}
                  className="btn btn--outline dashboard-header__create-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Date Range Filters */}
          <div className="card date-filters-card">
            <div className="card__body">
              <div className="date-filters__header">
                <h3 className="date-filters__title">Date Range</h3>
                <button 
                  className="btn btn--secondary btn--small date-filters__clear-btn"
                  onClick={clearFilters}
                >
                  Clear Filters
                </button>
              </div>
              
              <div className="date-filters__quick-filters">
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => handleDateRange('today')}
                >
                  Today
                </button>
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => handleDateRange('week')}
                >
                  This Week
                </button>
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => handleDateRange('month')}
                >
                  This Month
                </button>
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => handleDateRange('quarter')}
                >
                  Last Quarter
                </button>
              </div>
              
              <div className="date-filters__custom">
                <div className="date-filters__form-group">
                  <label htmlFor="startDate" className="form-label">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    className="form-control"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="date-filters__form-group">
                  <label htmlFor="endDate" className="form-label">End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <button 
                  className="btn btn--primary date-filters__apply-btn"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Apply Filters'}
                </button>
              </div>
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
                    <div className="progress-bar progress-bar--success" style={{width: `${(stats.openTickets / stats.totalTickets) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--progress">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Resolved Tickets</p>
                      <h4 className="stats-card__value">
                        {loading ? (
                          <span>Loading...</span>
                        ) : (
                          stats.resolvedTickets
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
                    <div className="progress-bar progress-bar--warning" style={{width: `${(stats.resolvedTickets / stats.totalTickets) * 100}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--priority">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Avg. Response Time</p>
                      <h4 className="stats-card__value">
                        {loading ? (
                          <span>Loading...</span>
                        ) : (
                          `${stats.avgResponseTime}h`
                        )}
                      </h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--danger">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--danger" style={{width: '100%'}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="card charts-card">
            <div className="card__body">
              <h3 className="charts-card__title">Data Visualization</h3>
              <Charts startDate={startDate} endDate={endDate} />
            </div>
          </div>

          {/* Report Type Selector */}
          <div className="card">
            <div className="card__body">
              <div className="report-type-selector">
                <h3>Select Report Type</h3>
                <div className="report-type-buttons">
                  <button 
                    className={`btn ${reportType === 'overview' ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => setReportType('overview')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`btn ${reportType === 'agents' ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => setReportType('agents')}
                  >
                    Agent Performance
                  </button>
                  <button 
                    className={`btn ${reportType === 'sla' ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => setReportType('sla')}
                  >
                    SLA Compliance
                  </button>
                  <button 
                    className={`btn ${reportType === 'trends' ? 'btn--primary' : 'btn--outline'}`}
                    onClick={() => setReportType('trends')}
                  >
                    Trends
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Report Content */}
          <div className="card">
            <div className="card__body">
              {error && (
                <div className="alert alert--danger">
                  <div className="alert__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  {error}
                </div>
              )}
              
              {loading ? (
                <div className="reports__loading">
                  <div className="spinner spinner--primary"></div>
                  <p>Loading report data...</p>
                </div>
              ) : (
                <div className="reports__content">
                  {reportType === 'overview' && (
                    <div className="reports__section">
                      <h4>Overview Report</h4>
                      <p>Comprehensive summary of ticket volumes, resolution times, and performance metrics.</p>
                      {/* Report content would go here */}
                    </div>
                  )}
                  
                  {reportType === 'agents' && (
                    <div className="reports__section">
                      <h4>Agent Performance Report</h4>
                      <p>Detailed breakdown of each agent's workload, response times, and resolution rates.</p>
                      {/* Report content would go here */}
                    </div>
                  )}
                  
                  {reportType === 'sla' && (
                    <div className="reports__section">
                      <h4>SLA Compliance Report</h4>
                      <p>Analysis of service level agreement compliance and breach patterns.</p>
                      {/* Report content would go here */}
                    </div>
                  )}
                  
                  {reportType === 'trends' && (
                    <div className="reports__section">
                      <h4>Trend Analysis Report</h4>
                      <p>Historical analysis of ticket trends, seasonal patterns, and predictive insights.</p>
                      {/* Report content would go here */}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;