import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FilterSidebar from "../components/FilterSidebar";
import OptimizedTicketRow from '../components/OptimizedTicketRow';
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
  const [agents, setAgents] = useState([]);
  const [filtersCollapsed, setFiltersCollapsed] = useState(false);
  const navigate = useNavigate();




  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        // Fetch tickets from the backend API
        const response = await api.get('/tickets?populate=createdBy');
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
    const fetchAgents = async () => {
      try {
        // Fetch agents from the backend API
        const response = await api.get('/users?role=support_agent');
        setAgents(response.data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        // Fallback to an empty array if API fails
        setAgents([]);
      }
    };

    fetchAgents();
  }, []);

  const filteredTicketsMemo = useMemo(() => {
    let filtered = [...tickets]; // Create a copy to avoid mutating the original array

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        (ticket.ticketId || ticket._id || ticket.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.title || ticket.subject).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.description && ticket.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
        (ticket.description && ticket.description.toLowerCase().includes(searchFields.toLowerCase())) ||
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
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.lastUpdated || b.createdAt) - new Date(a.lastUpdated || a.createdAt);
        case 'oldest':
          return new Date(a.lastUpdated || a.createdAt) - new Date(b.lastUpdated || b.createdAt);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case 'due_date':
          // Placeholder for due date sorting
          return new Date(b.lastUpdated || b.createdAt) - new Date(a.lastUpdated || a.createdAt);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tickets, searchTerm, statusFilter, priorityFilter, sortOption, currentView, filters]);

  // Update state when filtered tickets change
  useEffect(() => {
    setFilteredTickets(filteredTicketsMemo);
  }, [filteredTicketsMemo]);

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

  const handleAssignChange = async (ticket, newAssigneeId) => {
    try {
      // Prepare the update payload
      const updateData = {
        assignedTo: newAssigneeId !== 'unassigned' ? newAssigneeId : null
      };

      // Make API call to update the ticket
      const response = await api.put(`/tickets/${ticket._id}`, updateData);

      // Update the local state with the new ticket data
      setTickets(prevTickets => 
        prevTickets.map(t => 
          t._id === ticket._id ? response.data : t
        )
      );
      
      // Also update filtered tickets
      setFilteredTickets(prevFiltered => 
        prevFiltered.map(t => 
          t._id === ticket._id ? response.data : t
        )
      );
      
      console.log(`Ticket ${ticket.ticketId} assigned successfully to ${newAssigneeId}`);
    } catch (error) {
      console.error('Error assigning ticket:', error);
      alert(`Failed to assign ticket: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handleStatusChange = async (ticket, newStatus) => {
    try {
      // Make API call to update the ticket
      const response = await api.put(`/tickets/${ticket._id}`, {
        status: newStatus
      });

      // Update the local state with the new ticket data
      setTickets(prevTickets => 
        prevTickets.map(t => 
          t._id === ticket._id ? response.data : t
        )
      );
      
      // Also update filtered tickets
      setFilteredTickets(prevFiltered => 
        prevFiltered.map(t => 
          t._id === ticket._id ? response.data : t
        )
      );
      
      console.log(`Ticket ${ticket.ticketId} status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating ticket status:', error);
      alert(`Failed to update ticket status: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  const handlePriorityChange = async (ticket, newPriority) => {
    try {
      // Make API call to update the ticket
      const response = await api.put(`/tickets/${ticket._id}`, {
        priority: newPriority
      });

      // Update the local state with the new ticket data
      setTickets(prevTickets => 
        prevTickets.map(t => 
          t._id === ticket._id ? response.data : t
        )
      );
      
      // Also update filtered tickets
      setFilteredTickets(prevFiltered => 
        prevFiltered.map(t => 
          t._id === ticket._id ? response.data : t
        )
      );
      
      console.log(`Ticket ${ticket.ticketId} priority updated to ${newPriority}`);
    } catch (error) {
      console.error('Error updating ticket priority:', error);
      alert(`Failed to update ticket priority: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    }
  };

  // Define callback functions for FilterSidebar
  const handleFilterChange = useCallback((filters) => {
    setFilters(filters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);



  return (
    <div className="freshdesk-dashboard">
      <Navbar />
      {/* Header Bar */}
      <div className="freshdesk-header">
        <div className="freshdesk-header-content">
          <div className="freshdesk-search-container">
            <input
              type="text"
              placeholder="Search tickets, subjects, companies..."
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
            
            <button 
              className="freshdesk-filter-toggle-btn"
              onClick={() => setFiltersCollapsed(!filtersCollapsed)}
            >
              <svg className="freshdesk-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filters
            </button>
          </div>
        </div>
      </div>
      <div className="freshdesk-layout">
        <Sidebar />
        
        <div className={`freshdesk-content ${filtersCollapsed ? 'filters-hidden' : ''}`}>
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
                      <th>Company</th>
                      <th>Last Updated</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTickets.map(ticket => (
                      <OptimizedTicketRow
                        key={ticket.ticketId || ticket._id || ticket.id}
                        ticket={ticket}
                        selectedTickets={selectedTickets}
                        handleTicketClick={handleTicketClick}
                        handleSelectTicket={handleSelectTicket}
                        handleAssignChange={handleAssignChange}
                        handleStatusChange={handleStatusChange}
                        handlePriorityChange={handlePriorityChange}
                        agents={agents}
                        getTimeAgo={getTimeAgo}
                      />
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {/* Filter Sidebar - on the right */}
          {!filtersCollapsed && (
            <div className="freshdesk-filter-container">
              <div className="freshdesk-filter-header">
                <h3 className="freshdesk-filter-title">Filters</h3>
              </div>
              <FilterSidebar 
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          )}
        </div>
        

      </div>
    </div>
  );
};

export default Tickets;