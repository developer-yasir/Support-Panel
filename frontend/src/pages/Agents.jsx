import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Agents = () => {
  const [agents, setAgents] = useState([
    {
      id: 1,
      name: 'John Smith',
      email: 'john@company.com',
      status: 'online',
      role: 'Senior Agent',
      ticketsHandled: 24,
      avgResolutionTime: '2.3h',
      satisfaction: 4.7,
      lastActive: '2 minutes ago'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah@company.com',
      status: 'online',
      role: 'Team Lead',
      ticketsHandled: 18,
      avgResolutionTime: '2.8h',
      satisfaction: 4.5,
      lastActive: '5 minutes ago'
    },
    {
      id: 3,
      name: 'Michael Chen',
      email: 'michael@company.com',
      status: 'away',
      role: 'Support Agent',
      ticketsHandled: 15,
      avgResolutionTime: '3.5h',
      satisfaction: 4.2,
      lastActive: '15 minutes ago'
    },
    {
      id: 4,
      name: 'Emily Davis',
      email: 'emily@company.com',
      status: 'offline',
      role: 'Support Agent',
      ticketsHandled: 12,
      avgResolutionTime: '2.9h',
      satisfaction: 4.6,
      lastActive: '2 hours ago'
    },
    {
      id: 5,
      name: 'David Wilson',
      email: 'david@company.com',
      status: 'offline',
      role: 'Senior Agent',
      ticketsHandled: 22,
      avgResolutionTime: '2.1h',
      satisfaction: 4.8,
      lastActive: '4 hours ago'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const navigate = useNavigate();

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = 
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || agent.status === statusFilter;
    const matchesRole = roleFilter === 'all' || agent.role.toLowerCase().includes(roleFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800';
      case 'away':
        return 'bg-yellow-100 text-yellow-800';
      case 'offline':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Agents
                </h1>
                <p className="dashboard-header__subtitle">Manage and monitor your support agents</p>
              </div>
              <div className="dashboard-header__actions">
                <button className="btn btn--primary" onClick={() => navigate('/ticket/new')}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Agent
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="card filters-card">
            <div className="card__body">
              <div className="filters-card__header">
                <h3 className="filters-card__title">Filters</h3>
              </div>
              
              <div className="filters-card__form">
                <div className="filters-card__form-group">
                  <label htmlFor="search" className="form-label filters-card__label">Search Agents</label>
                  <input
                    type="text"
                    id="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="form-control"
                    placeholder="Search by name or email..."
                  />
                </div>
                
                <div className="filters-card__form-row" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
                  <div className="filters-card__form-group" style={{flex: 1, minWidth: '200px'}}>
                    <label htmlFor="status" className="form-label filters-card__label">Status</label>
                    <select
                      id="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="form-control form-control--select"
                    >
                      <option value="all">All Statuses</option>
                      <option value="online">Online</option>
                      <option value="away">Away</option>
                      <option value="offline">Offline</option>
                    </select>
                  </div>
                  
                  <div className="filters-card__form-group" style={{flex: 1, minWidth: '200px'}}>
                    <label htmlFor="role" className="form-label filters-card__label">Role</label>
                    <select
                      id="role"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="form-control form-control--select"
                    >
                      <option value="all">All Roles</option>
                      <option value="agent">Support Agent</option>
                      <option value="lead">Team Lead</option>
                      <option value="senior">Senior Agent</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Agents Table */}
          <div className="card">
            <div className="card__body">
              <div className="table-container">
                <table className="table table--striped">
                  <thead>
                    <tr>
                      <th>Agent</th>
                      <th>Status</th>
                      <th>Role</th>
                      <th>Tickets Handled</th>
                      <th>Avg. Resolution Time</th>
                      <th>Satisfaction</th>
                      <th>Last Active</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAgents.map((agent) => (
                      <tr key={agent.id}>
                        <td>
                          <div className="agent-info-cell">
                            <div className="agent-avatar">
                              {agent.name.charAt(0)}
                            </div>
                            <div className="agent-details">
                              <div className="agent-name">{agent.name}</div>
                              <div className="agent-email">{agent.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${getStatusColor(agent.status)}`}>
                            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                          </span>
                        </td>
                        <td>{agent.role}</td>
                        <td>{agent.ticketsHandled}</td>
                        <td>{agent.avgResolutionTime}</td>
                        <td>
                          <div className="rating">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                xmlns="http://www.w3.org/2000/svg" 
                                className={`icon ${i < Math.floor(agent.satisfaction || 0) ? 'text-warning' : 'text-muted'}`} 
                                fill="currentColor" 
                                viewBox="0 0 24 24" 
                                width="14" 
                                height="14"
                              >
                                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                              </svg>
                            ))}
                            <span className="ml-1">{agent.satisfaction}</span>
                          </div>
                        </td>
                        <td>{agent.lastActive}</td>
                        <td>
                          <div className="agent-actions">
                            <button className="btn btn--ghost btn--small">View</button>
                            <button className="btn btn--ghost btn--small">Edit</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredAgents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state__icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="empty-state__title">No agents found</h3>
                  <p className="empty-state__description">Try adjusting your filters</p>
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