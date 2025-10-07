import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboardSettings } from '../contexts/DashboardSettingsContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Export from '../components/Export';
import Charts from '../components/Charts';
import RecentActivity from '../components/Dashboard/RecentActivity';
import AgentPerformance from '../components/Dashboard/AgentPerformance';
import CompanyTickets from '../components/Dashboard/CompanyTickets';

import { api } from '../services/api';
import WebSocketService from '../services/websocket';

const Overview = () => {
  const { dashboardSettings, updateSetting } = useDashboardSettings();
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    highPriorityTickets: 0
  });
  const [loading, setStatsLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [newTicketsCount, setNewTicketsCount] = useState(0);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const lastTotalTickets = useRef(0);
  const previousStats = useRef({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    highPriorityTickets: 0
  });
  const refreshInterval = useRef(null);
  const statsTimeoutRef = useRef(null);
  const navigate = useNavigate();

  // Function to calculate date ranges
  const getDateRange = (range) => {
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
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    };
  };

  // Function to apply date range filter
  const applyDateRange = (range) => {
    const { startDate, endDate } = getDateRange(range);
    setStartDate(startDate);
    setEndDate(endDate);
  };

  // Function to clear date filters
  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  // Function to fetch stats with date filters
  const fetchStats = async () => {
    try {
      setStatsLoading(true);
      const queryParams = new URLSearchParams();
      
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);
      
      const url = `/tickets/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await api.get(url);
      
      const newStats = response.data;
      
      // Compare new stats with current stats to determine if update is needed
      const shouldUpdate = 
        stats.totalTickets !== newStats.totalTickets ||
        stats.openTickets !== newStats.openTickets ||
        stats.inProgressTickets !== newStats.inProgressTickets ||
        stats.highPriorityTickets !== newStats.highPriorityTickets;
      
      if (shouldUpdate) {
        // Check for new tickets
        if (lastTotalTickets.current > 0 && newStats.totalTickets > lastTotalTickets.current) {
          setNewTicketsCount(newStats.totalTickets - lastTotalTickets.current);
          // Clear notification after 5 seconds
          setTimeout(() => {
            setNewTicketsCount(0);
          }, 5000);
        }
        
        lastTotalTickets.current = newStats.totalTickets;
        setStats(newStats);
        // Update previous stats ref to track for next comparison
        previousStats.current = { ...newStats };
      }
    } catch (err) {
      console.error('Failed to fetch ticket statistics:', err);
      setError('Failed to fetch ticket statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  const debouncedFetchStats = useCallback(() => {
    // Clear any existing timeout to debounce the request
    if (statsTimeoutRef.current) {
      clearTimeout(statsTimeoutRef.current);
    }
    
    // Set a new timeout that will execute the fetch after 1000ms (1 second)
    statsTimeoutRef.current = setTimeout(() => {
      fetchStats();
    }, 1000);
  }, [fetchStats, startDate, endDate]);

  // Set page title
  useEffect(() => {
    document.title = 'Dashboard - Support Panel';
  }, []);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((data) => {
    // When we receive a ticket update message, refresh the stats
    if (data.type === 'ticket_update' || data.type === 'new_ticket') {
      debouncedFetchStats();
    }
  }, [debouncedFetchStats]);

  // Define stable WebSocket event handlers for proper cleanup
  const handleWebSocketError = useCallback((error) => {
    console.error('WebSocket error:', error);
  }, []);

  const handleWebSocketClose = useCallback((event) => {
    console.log('WebSocket closed:', event);
  }, []);

  // Set up auto-refresh every 30 seconds and WebSocket connection
  useEffect(() => {
    // Fetch immediately on component mount
    fetchStats();
    
    // Set up interval for auto-refresh
    refreshInterval.current = setInterval(() => {
      debouncedFetchStats();
    }, 30000); // 30 seconds
    
    // Set up WebSocket connection
    // Make sure to connect to the correct WebSocket endpoint (strip /api if present)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const cleanBackendUrl = backendUrl.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl;
    const wsProtocol = cleanBackendUrl.startsWith('https') ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${cleanBackendUrl.replace(/^https?:\/\/|^http?:\/\//, '')}/ws`;
    
    console.log('Connecting to WebSocket:', wsUrl); // Debug log
    WebSocketService.connect(wsUrl);
    WebSocketService.addListener('message', handleWebSocketMessage);
    WebSocketService.addListener('error', handleWebSocketError);
    WebSocketService.addListener('close', handleWebSocketClose);
    
    // Clean up interval and WebSocket on component unmount
    return () => {
      if (refreshInterval.current) {
        clearInterval(refreshInterval.current);
      }
      // Clear any pending timeout
      if (statsTimeoutRef.current) {
        clearTimeout(statsTimeoutRef.current);
      }
      WebSocketService.removeListener('message', handleWebSocketMessage);
      WebSocketService.removeListener('error', handleWebSocketError);
      WebSocketService.removeListener('close', handleWebSocketClose);
      WebSocketService.disconnect();
    };
  }, [startDate, endDate, debouncedFetchStats]);

  // Set up WebSocket connection separately to avoid reconnection on filter changes
  useEffect(() => {
    // Set up WebSocket connection
    // Make sure to connect to the correct WebSocket endpoint (strip /api if present)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const cleanBackendUrl = backendUrl.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl;
    const wsProtocol = cleanBackendUrl.startsWith('https') ? 'wss' : 'ws';
    const wsUrl = `${wsProtocol}://${cleanBackendUrl.replace(/^https?:\/\/|^http?:\/\//, '')}/ws`;
    
    console.log('Connecting to WebSocket (separate effect):', wsUrl); // Debug log
    WebSocketService.connect(wsUrl);
    WebSocketService.addListener('message', handleWebSocketMessage);
    WebSocketService.addListener('error', handleWebSocketError);
    WebSocketService.addListener('close', handleWebSocketClose);
    
    // Clean up WebSocket on component unmount
    return () => {
      WebSocketService.removeListener('message', handleWebSocketMessage);
      WebSocketService.removeListener('error', handleWebSocketError);
      WebSocketService.removeListener('close', handleWebSocketClose);
      WebSocketService.disconnect();
    };
  }, [handleWebSocketMessage, handleWebSocketError, handleWebSocketClose]); // Only re-run if callbacks change

  // Reset new tickets count when filters change
  useEffect(() => {
    setNewTicketsCount(0);
    lastTotalTickets.current = 0;
  }, [startDate, endDate]);







  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
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
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </h1>
                <p className="dashboard-header__subtitle">Welcome to your support panel</p>
              </div>
              <div className="dashboard-header__actions">
                {/* Notification badge for new tickets */}
                {newTicketsCount > 0 && (
                  <div className="notification-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon notification-badge__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="notification-badge__count">{newTicketsCount} new</span>
                  </div>
                )}
                <button
                  className="btn btn--outline btn--small"
                  onClick={() => setShowSettingsPanel(!showSettingsPanel)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </button>
                <Export stats={stats} startDate={startDate} endDate={endDate} />
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
          </div>

          {/* Dashboard Settings Panel */}
          {showSettingsPanel && (
            <div className="dashboard__settings-panel card">
              <div className="card__body">
                <div className="dashboard-settings__header">
                  <h3 className="card__title">Dashboard Settings</h3>
                  <button 
                    className="btn btn--secondary btn--small"
                    onClick={() => setShowSettingsPanel(false)}
                  >
                    Close
                  </button>
                </div>
                
                <div className="dashboard-settings__grid">
                  <div className="dashboard-setting-item">
                    <div className="settings__toggle-group">
                      <label htmlFor="showRecentActivity" className="form-label settings__label">
                        Recent Activity
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="showRecentActivity"
                          name="showRecentActivity"
                          checked={dashboardSettings.showRecentActivity}
                          onChange={() => handleSettingToggle('showRecentActivity')}
                          className="settings__toggle-input"
                        />
                        <label htmlFor="showRecentActivity" className="settings__toggle-label">
                          <span className="settings__toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  

                  
                  <div className="dashboard-setting-item">
                    <div className="settings__toggle-group">
                      <label htmlFor="showAgentPerformance" className="form-label settings__label">
                        Agent Performance
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="showAgentPerformance"
                          name="showAgentPerformance"
                          checked={dashboardSettings.showAgentPerformance}
                          onChange={() => handleSettingToggle('showAgentPerformance')}
                          className="settings__toggle-input"
                        />
                        <label htmlFor="showAgentPerformance" className="settings__toggle-label">
                          <span className="settings__toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  

                  
                  <div className="dashboard-setting-item">
                    <div className="settings__toggle-group">
                      <label htmlFor="showTicketAgeAnalysis" className="form-label settings__label">
                        Ticket Age Analysis
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="showTicketAgeAnalysis"
                          name="showTicketAgeAnalysis"
                          checked={dashboardSettings.showTicketAgeAnalysis}
                          onChange={() => handleSettingToggle('showTicketAgeAnalysis')}
                          className="settings__toggle-input"
                        />
                        <label htmlFor="showTicketAgeAnalysis" className="settings__toggle-label">
                          <span className="settings__toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  {/* Removed less essential components for cleaner UI */}
                </div>
              </div>
            </div>
          )}

          {/* Date Range Filters */}
          <div className="card date-filters-card">
            <div className="card__body">
              <div className="date-filters__header">
                <h3 className="date-filters__title">Date Range Filters</h3>
                <div className="date-filters__actions">
                  <button 
                    className="btn btn--secondary btn--small date-filters__clear-btn"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                  <button
                    className="btn btn--outline btn--small"
                    onClick={() => {
                      // Clear date filters
                      setStartDate('');
                      setEndDate('');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
              
              <div className="date-filters__quick-filters">
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => applyDateRange('today')}
                >
                  Today
                </button>
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => applyDateRange('week')}
                >
                  This Week
                </button>
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => applyDateRange('month')}
                >
                  This Month
                </button>
                <button 
                  className="btn btn--outline btn--small date-filters__quick-btn"
                  onClick={() => applyDateRange('quarter')}
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
                  onClick={debouncedFetchStats}
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

          {/* Static Dashboard Widgets (Non-Resizable) */}
          <div className="dashboard-widgets-grid">
            <div className="dashboard-widget dashboard-widget--full-width">
              <div className="dashboard-widget__header">
                <h3 className="dashboard-widget__title">Data Visualization</h3>
              </div>
              <div className="dashboard-widget__body">
                <Charts startDate={startDate} endDate={endDate} />
              </div>
            </div>
            
            <div className="dashboard-widgets-row">
              <div className="dashboard-widget dashboard-widget--half-width">
                <div className="dashboard-widget__header">
                  <h3 className="dashboard-widget__title">Company Ticket Overview</h3>
                </div>
                <div className="dashboard-widget__body">
                  <CompanyTickets startDate={startDate} endDate={endDate} />
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