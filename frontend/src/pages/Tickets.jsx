import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FilterSidebar from "../components/FilterSidebar";
import '../pages/FreshdeskStyles.css';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('all');
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();




  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Fetch tickets from the backend API
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        // Fallback to an empty array if API fails
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  useEffect(() => {
    let filtered = tickets;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        (ticket.ticketId || ticket._id || ticket.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.title || ticket.subject).toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.createdBy?.name && ticket.createdBy.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.createdBy?.email && ticket.createdBy.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (ticket.assignedTo?.name && ticket.assignedTo.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply status filter from dropdown
    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }
    
    // Apply priority filter from dropdown
    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    // Apply advanced filters from the filter sidebar
    const { 
      searchFields,
      createdDate,
      closedDate,
      resolvedDate,
      resolutionDueDate,
      firstResponseDueDate,
      statusFilter: advancedStatusFilter,
      priorityFilter: advancedPriorityFilter,
      typesFilter,
      sourcesFilter,
      tagsFilter,
      companiesFilter,
      contactsFilter,
      countryFilter,
      categoryFilter
    } = filters;

    // Apply search fields filter
    if (searchFields) {
      filtered = filtered.filter(ticket =>
        (ticket.ticketId || ticket._id || ticket.id).toLowerCase().includes(searchFields.toLowerCase()) ||
        (ticket.title || ticket.subject).toLowerCase().includes(searchFields.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchFields.toLowerCase()) ||
        (ticket.createdBy?.name && ticket.createdBy.name.toLowerCase().includes(searchFields.toLowerCase())) ||
        (ticket.createdBy?.email && ticket.createdBy.email.toLowerCase().includes(searchFields.toLowerCase())) ||
        (ticket.assignedTo?.name && ticket.assignedTo.name.toLowerCase().includes(searchFields.toLowerCase()))
      );
    }

    // Apply created date filter
    if (createdDate) {
      filtered = filtered.filter(ticket => {
        const ticketCreated = new Date(ticket.createdAt || ticket.createdAt).toISOString().split('T')[0];
        return ticketCreated === createdDate;
      });
    }

    // Apply closed date filter - note: backend doesn't have closedAt/resolvedAt in ticket, so skip

    // Apply status filter from advanced filters
    if (advancedStatusFilter) {
      filtered = filtered.filter(ticket => ticket.status === advancedStatusFilter);
    }

    // Apply priority filter from advanced filters
    if (advancedPriorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === advancedPriorityFilter);
    }

    // Apply types filter - note: backend doesn't have type in ticket, so skip

    // Apply sources filter - note: backend doesn't have channel in ticket, so skip

    // Apply tags filter - note: backend doesn't have tags in ticket, so skip

    // Apply companies filter - note: backend doesn't have company in ticket, so skip or handle differently
    // Apply contacts filter - note: backend doesn't have requester name in ticket, so skip or handle differently
    // Apply country filter - note: backend doesn't have country in ticket, so skip or handle differently

    // Apply category filter - note: backend doesn't have category in ticket, so skip

    // Apply view filter
    switch (currentView) {
      case 'my_open':
        filtered = filtered.filter(ticket => ticket.status === 'open' && ticket.assignedTo?.name);
        break;
      case 'unassigned':
        filtered = filtered.filter(ticket => !ticket.assignedTo);
        break;
      case 'overdue':
        // In a real app, this would check due dates
        filtered = filtered.filter(ticket => ticket.status !== 'closed');
        break;
      case 'closed':
        filtered = filtered.filter(ticket => ticket.status === 'closed');
        break;
      default:
        // All tickets
        break;
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        case 'oldest':
          return new Date(a.lastUpdated) - new Date(b.lastUpdated);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'due_date':
          // Placeholder for due date sorting
          return new Date(b.lastUpdated) - new Date(a.lastUpdated);
        default:
          return 0;
      }
    });

    setFilteredTickets(filtered);
  }, [tickets, searchTerm, statusFilter, priorityFilter, sortOption, currentView, filters]);

  const handleTicketClick = useCallback((ticket) => {
    navigate(`/ticket/${ticket.ticketId || ticket._id || ticket.id}`);
  }, [navigate]);

  const handleSelectTicket = useCallback((ticketId) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  }, [selectedTickets]);

  const handleSelectAll = useCallback(() => {
    if (selectedTickets.size === filteredTickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(filteredTickets.map(ticket => ticket.ticketId || ticket._id || ticket.id)));
    }
  }, [selectedTickets.size, filteredTickets]);

  const handleBulkAction = useCallback((action) => {
    console.log(`${action} ${selectedTickets.size} tickets`);
    setSelectedTickets(new Set()); // Clear selection after action
  }, [selectedTickets.size]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-yellow-100 text-yellow-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };



  return (
    <div className="freshdesk-dashboard">
      <Navbar />
      {/* Header Bar */}
      <div className="freshdesk-header">
        <div className="freshdesk-header-content">
          <div className="freshdesk-search-container">
            <input
              type="text"
              placeholder="Search tickets, subjects, requesters..."
              className="freshdesk-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="freshdesk-search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="freshdesk-header-actions">
            <select 
              className="freshdesk-filter-select tickets-page-priority-select-filter"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
              <option value="priority">Priority</option>
              <option value="due_date">Due Date</option>
            </select>
            
            <button 
              className="freshdesk-new-ticket-btn"
              onClick={() => navigate('/ticket/new')}
            >
              <svg className="freshdesk-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Ticket
            </button>
          </div>
        </div>
      </div>
      <div className="freshdesk-layout">
        <Sidebar />
        
        <div className="freshdesk-content">
          {/* Center Ticket List */}
          <div className="freshdesk-main-content">
            <div className="freshdesk-ticket-list-header">
              <div className="freshdesk-bulk-actions">
                <input
                  type="checkbox"
                  className="freshdesk-checkbox"
                  checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
                  onChange={handleSelectAll}
                />
                {selectedTickets.size > 0 && (
                  <div className="freshdesk-bulk-actions-menu">
                    <button className="freshdesk-bulk-action-btn" onClick={() => handleBulkAction('change status')}>
                      Change Status
                    </button>
                    <button className="freshdesk-bulk-action-btn" onClick={() => handleBulkAction('assign')}>
                      Assign
                    </button>
                    <button className="freshdesk-bulk-action-btn" onClick={() => handleBulkAction('delete')}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
              <div className="freshdesk-ticket-count">
                {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
              </div>
            </div>
            
            <div className="freshdesk-ticket-list">
              {loading ? (
                <div className="freshdesk-loading">
                  <div className="freshdesk-spinner"></div>
                  <p>Loading tickets...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="freshdesk-empty-state">
                  <svg className="freshdesk-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3>No tickets found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              ) : (
                <table className="freshdesk-ticket-table">
                  <thead>
                    <tr>
                      <th width="40">
                        <input
                          type="checkbox"
                          className="freshdesk-checkbox"
                          checked={selectedTickets.size === filteredTickets.length && filteredTickets.length > 0}
                          onChange={handleSelectAll}
                        />
                      </th>
                      <th width="100">Ticket ID</th>
                      <th>Subject</th>
                      <th>Requester</th>
                      <th>Assigned To</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Last Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <tr 
                        key={ticket.ticketId || ticket._id || ticket.id} 
                        className={`freshdesk-ticket-row ticket-row ${selectedTickets.has(ticket.ticketId || ticket._id || ticket.id) ? 'selected' : ''}`}
                        onClick={() => handleTicketClick(ticket)}
                      >
                        <td>
                          <input
                            type="checkbox"
                            className="freshdesk-checkbox"
                            checked={selectedTickets.has(ticket.ticketId || ticket._id || ticket.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectTicket(ticket.ticketId || ticket._id || ticket.id);
                            }}
                          />
                        </td>
                        <td>
                          <div className="freshdesk-ticket-id">{ticket.ticketId || ticket._id || ticket.id}</div>
                        </td>
                        <td>
                          <div className="freshdesk-ticket-subject">{ticket.title || ticket.subject}</div>
                          <div className="freshdesk-ticket-description">
                            {ticket.description.substring(0, 100)}...
                          </div>
                        </td>
                        <td>
                          <div className="freshdesk-requester-info">
                            <div className="freshdesk-requester-name">{ticket.createdBy?.name || 'N/A'}</div>
                            <div className="freshdesk-requester-email">{ticket.createdBy?.email || 'N/A'}</div>
                          </div>
                        </td>
                        <td>
                          {ticket.assignedTo ? (
                            <div className="freshdesk-agent-badge">
                              <span className="freshdesk-agent-avatar">{ticket.assignedTo.name?.charAt(0) || 'A'}</span>
                              <span className="freshdesk-agent-name">{ticket.assignedTo.name}</span>
                            </div>
                          ) : (
                            <span className="freshdesk-unassigned">Unassigned</span>
                          )}
                        </td>
                        <td>
                          <span className={`freshdesk-status-badge ${getStatusColor(ticket.status)}`}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`freshdesk-priority-badge ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div className="freshdesk-time-ago">{getTimeAgo(ticket.lastUpdated)}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Filter Sidebar - on the right */}
          <FilterSidebar 
            onFilterChange={useCallback((filters) => {
              // Update the filtering logic based on the new filters
              setFilters(filters);
            }, [setFilters])}
            onClearFilters={useCallback(() => {
              // Reset the filters state
              setFilters({});
            }, [setFilters])}
          />
        </div>
        

      </div>
    </div>
  );
};

export default Tickets;