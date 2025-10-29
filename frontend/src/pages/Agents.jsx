import './Agents.css';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Agents = () => {
  const [agents, setAgents] = useState([]);
  const [filteredAgents, setFilteredAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const navigate = useNavigate();

  // Stats for the dashboard
  const [agentStats, setAgentStats] = useState({
    totalAgents: 0,
    onlineAgents: 0,
    busyAgents: 0,
    offlineAgents: 0,
    avgResolutionTime: 0,
    ticketsHandled: 0,
    avgTicketsPerAgent: 0
  });

  // Mock data initialization - in a real app, this would come from the API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        // In a real app, this would be: const response = await api.get('/agents');
        // For now, using mock data
        const mockAgents = [
          {
            id: 1,
            name: 'John Smith',
            email: 'john@company.com',
            status: 'online',
            role: 'Senior Agent',
            ticketsHandled: 24,
            avgResolutionTime: 2.3,
            lastActive: new Date(Date.now() - 2 * 60000) // 2 minutes ago
          },
          {
            id: 2,
            name: 'Sarah Johnson',
            email: 'sarah@company.com',
            status: 'online',
            role: 'Team Lead',
            ticketsHandled: 18,
            avgResolutionTime: 2.8,
            lastActive: new Date(Date.now() - 5 * 60000) // 5 minutes ago
          },
          {
            id: 3,
            name: 'Michael Chen',
            email: 'michael@company.com',
            status: 'busy',
            role: 'Support Agent',
            ticketsHandled: 15,
            avgResolutionTime: 3.5,
            lastActive: new Date(Date.now() - 15 * 60000) // 15 minutes ago
          },
          {
            id: 4,
            name: 'Emily Davis',
            email: 'emily@company.com',
            status: 'offline',
            role: 'Support Agent',
            ticketsHandled: 12,
            avgResolutionTime: 2.9,
            lastActive: new Date(Date.now() - 2 * 3600000) // 2 hours ago
          },
          {
            id: 5,
            name: 'David Wilson',
            email: 'david@company.com',
            status: 'offline',
            role: 'Senior Agent',
            ticketsHandled: 22,
            avgResolutionTime: 2.1,
            lastActive: new Date(Date.now() - 4 * 3600000) // 4 hours ago
          },
          {
            id: 6,
            name: 'Lisa Anderson',
            email: 'lisa@company.com',
            status: 'online',
            role: 'Support Agent',
            ticketsHandled: 19,
            avgResolutionTime: 2.6,
            lastActive: new Date(Date.now() - 1 * 60000) // 1 minute ago
          },
          {
            id: 7,
            name: 'Robert Garcia',
            email: 'robert@company.com',
            status: 'away',
            role: 'Support Agent',
            ticketsHandled: 11,
            avgResolutionTime: 3.1,
            lastActive: new Date(Date.now() - 30 * 60000) // 30 minutes ago
          },
          {
            id: 8,
            name: 'Amanda Taylor',
            email: 'amanda@company.com',
            status: 'online',
            role: 'Team Lead',
            ticketsHandled: 21,
            avgResolutionTime: 2.2,
            lastActive: new Date(Date.now() - 3 * 60000) // 3 minutes ago
          }
        ];

        setAgents(mockAgents);
        
        // Calculate stats
        const totalAgents = mockAgents.length;
        const onlineAgents = mockAgents.filter(agent => agent.status === 'online').length;
        const busyAgents = mockAgents.filter(agent => agent.status === 'busy').length;
        const offlineAgents = mockAgents.filter(agent => agent.status === 'offline').length;

        const avgResolutionTime = mockAgents.length > 0 
          ? (mockAgents.reduce((sum, agent) => sum + agent.avgResolutionTime, 0) / mockAgents.length).toFixed(1) 
          : 0;
        const ticketsHandled = mockAgents.reduce((sum, agent) => sum + agent.ticketsHandled, 0);
        const avgTicketsPerAgent = mockAgents.length > 0 
          ? (ticketsHandled / mockAgents.length).toFixed(1) 
          : 0;

        setAgentStats({
          totalAgents,
          onlineAgents,
          busyAgents,
          offlineAgents,
          avgResolutionTime,
          ticketsHandled,
          avgTicketsPerAgent
        });
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...agents];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(agent => 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(agent => agent.status === statusFilter);
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(agent => agent.role.toLowerCase().includes(roleFilter.toLowerCase()));
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'role':
          aValue = a.role;
          bValue = b.role;
          break;
        case 'tickets':
          aValue = a.ticketsHandled;
          bValue = b.ticketsHandled;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
    
    setFilteredAgents(result);
  }, [agents, searchTerm, statusFilter, roleFilter, sortBy, sortOrder]);

  // Status badge utility
  const getStatusBadge = (status) => {
    const baseClasses = "badge badge--sm";
    switch (status) {
      case 'online':
        return <span className={`${baseClasses} badge--success`}>Online</span>;
      case 'busy':
        return <span className={`${baseClasses} badge--warning`}>Busy</span>;
      case 'away':
        return <span className={`${baseClasses} badge--info`}>Away</span>;
      case 'offline':
        return <span className={`${baseClasses} badge--secondary`}>Offline</span>;
      default:
        return <span className={`${baseClasses} badge--secondary`}>{status}</span>;
    }
  };

  // Format time for display
  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Format resolution time
  const formatResolutionTime = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} min`;
    return `${hours.toFixed(1)}h`;
  };





  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          {/* Modern Dashboard Header */}
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__info">
                <div className="dashboard-header__title-wrapper">
                  <h1 className="dashboard-header__title">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Agent Management
                  </h1>
                  <p className="dashboard-header__subtitle">Monitor and manage your support team</p>
                </div>
              </div>
              <div className="dashboard-header__actions">
                <button className="btn btn--primary" onClick={() => navigate('/agent/new')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Agent
                </button>
              </div>
            </div>
          </div>

          {/* Agent Stats Grid */}
          <div className="dashboard__stats-grid">
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--total stats-card--elevated">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Total Agents</p>
                      <h4 className="stats-card__value">{agentStats.totalAgents}</h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
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
              <div className="stats-card stats-card--online stats-card--elevated">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Online Agents</p>
                      <h4 className="stats-card__value">{agentStats.onlineAgents}</h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--success" style={{width: `${agentStats.totalAgents > 0 ? (agentStats.onlineAgents / agentStats.totalAgents) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--busy stats-card--elevated">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Busy Agents</p>
                      <h4 className="stats-card__value">{agentStats.busyAgents}</h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--warning">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--warning" style={{width: `${agentStats.totalAgents > 0 ? (agentStats.busyAgents / agentStats.totalAgents) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="dashboard__stats-col">
              <div className="stats-card stats-card--offline stats-card--elevated">
                <div className="stats-card__content">
                  <div className="stats-card__header">
                    <div className="stats-card__info">
                      <p className="stats-card__label">Offline Agents</p>
                      <h4 className="stats-card__value">{agentStats.offlineAgents}</h4>
                    </div>
                    <div className="stats-card__icon-wrapper stats-card__icon-wrapper--secondary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                      </svg>
                    </div>
                  </div>
                  <div className="stats-card__progress">
                    <div className="progress-bar progress-bar--secondary" style={{width: `${agentStats.totalAgents > 0 ? (agentStats.offlineAgents / agentStats.totalAgents) * 100 : 0}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secondary stats */}
          <div className="dashboard__secondary-stats-grid">

            
            <div className="stats-card stats-card--elevated stats-card--sm">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">Avg. Resolution</p>
                    <h4 className="stats-card__value">{agentStats.avgResolutionTime}h</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--info">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__footer">
                  <div className="stats-card__trend">↓ 0.3h from last month</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card stats-card--elevated stats-card--sm">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">Tickets Handled</p>
                    <h4 className="stats-card__value">{agentStats.ticketsHandled}</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__footer">
                  <div className="stats-card__trend">↑ 15% from last month</div>
                </div>
              </div>
            </div>
            
            <div className="stats-card stats-card--elevated stats-card--sm">
              <div className="stats-card__content">
                <div className="stats-card__header">
                  <div className="stats-card__info">
                    <p className="stats-card__label">Per Agent</p>
                    <h4 className="stats-card__value">{agentStats.avgTicketsPerAgent}</h4>
                  </div>
                  <div className="stats-card__icon-wrapper stats-card__icon-wrapper--warning">
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon stats-card__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <div className="stats-card__footer">
                  <div className="stats-card__trend">↑ 2% from last month</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters Card */}
          <div className="card date-filters-card">
            <div className="card__body">
              <div className="date-filters__header">
                <h3 className="date-filters__title">Filter Agents</h3>
              </div>
              
              <div className="date-filters__custom">
                <div className="date-filters__form-group">
                  <label htmlFor="search" className="form-label">Search</label>
                  <input
                    type="text"
                    id="search"
                    className="form-control"
                    placeholder="Search by name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="date-filters__form-row" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <div className="date-filters__form-group" style={{flex: 1, minWidth: '200px'}}>
                    <label htmlFor="statusFilter" className="form-label">Status</label>
                    <select
                      id="statusFilter"
                      className="form-control form-control--select"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="online">Online</option>
                      <option value="busy">Busy</option>
                      <option value="away">Away</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  
                  <div className="date-filters__form-group" style={{flex: 1, minWidth: '200px'}}>
                    <label htmlFor="roleFilter" className="form-label">Role</label>
                    <select
                      id="roleFilter"
                      className="form-control form-control--select"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                    >
                      <option value="all">All Roles</option>
                      <option value="Support Agent">Support Agent</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Senior Agent">Senior Agent</option>
                    </select>
                  </div>
                  
                  <div className="date-filters__form-group" style={{flex: 1, minWidth: '200px'}}>
                    <label htmlFor="sortBy" className="form-label">Sort By</label>
                    <select
                      id="sortBy"
                      className="form-control form-control--select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <option value="name">Name</option>
                      <option value="status">Status</option>
                      <option value="role">Role</option>
                      <option value="tickets">Tickets Handled</option>
                    </select>
                  </div>
                  
                  <div className="date-filters__form-group" style={{flex: 1, minWidth: '200px'}}>
                    <label htmlFor="sortOrder" className="form-label">Order</label>
                    <select
                      id="sortOrder"
                      className="form-control form-control--select"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="asc">Ascending</option>
                      <option value="desc">Descending</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agents List */}
          <div className="card">
            <div className="card__header">
              <div className="card__header-content">
                <h2 className="card__title">Agent List</h2>
                <div className="card__controls">
                  <div className="card__count">{filteredAgents.length} {filteredAgents.length === 1 ? 'agent' : 'agents'}</div>
                </div>
              </div>
            </div>
            <div className="card__body">
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading agents...</p>
                </div>
              ) : filteredAgents.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state__icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="empty-state__title">No agents found</h3>
                  <p className="empty-state__description">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Role</th>
                        <th>Tickets Handled</th>
                        <th>Avg. Resolution Time</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAgents.map((agent) => (
                        <tr key={agent.id}>
                          <td>{agent.name}</td>
                          <td>{agent.email}</td>
                          <td>{getStatusBadge(agent.status)}</td>
                          <td>{agent.role}</td>
                          <td>{agent.ticketsHandled}</td>
                          <td>{formatResolutionTime(agent.avgResolutionTime)}</td>
                          <td>
                            <button
                              className="btn btn--secondary btn--small"
                              onClick={() => navigate(`/agent/${agent.id}`)}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agents;