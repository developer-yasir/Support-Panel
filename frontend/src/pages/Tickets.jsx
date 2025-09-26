import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TicketCard from '../components/TicketCard';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assignedTo: '',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const ticketsPerPage = 10;
  const navigate = useNavigate();

  // Fetch real tickets from the API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tickets');
        setTickets(response.data);
      } catch (err) {
        setError('Failed to fetch tickets');
        console.error('Error fetching tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Filter tickets based on filters
  const filteredTickets = tickets.filter(ticket => {
    return (
      (filters.status === '' || ticket.status === filters.status) &&
      (filters.priority === '' || ticket.priority === filters.priority) &&
      (filters.assignedTo === '' || (ticket.assignedTo && (ticket.assignedTo.name || ticket.assignedTo._id).includes(filters.assignedTo))) &&
      (filters.search === '' || 
       ticket.title.toLowerCase().includes(filters.search.toLowerCase()) || 
       (ticket.description && ticket.description.toLowerCase().includes(filters.search.toLowerCase())) ||
       (ticket.createdBy && ticket.createdBy.name && ticket.createdBy.name.toLowerCase().includes(filters.search.toLowerCase())))
    );
  });

  // Pagination
  const indexOfLastTicket = currentPage * ticketsPerPage;
  const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
  const currentTickets = filteredTickets.slice(indexOfFirstTicket, indexOfLastTicket);
  const totalPages = Math.ceil(filteredTickets.length / ticketsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const resetFilters = () => {
    setFilters({
      status: '',
      priority: '',
      assignedTo: '',
      search: ''
    });
    setCurrentPage(1);
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Tickets
                </h1>
                <p className="dashboard-header__subtitle">Manage and track all customer support tickets</p>
              </div>
              <div className="dashboard-header__actions">
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

          {/* Filters */}
          <div className="card filters-card">
            <div className="card__body">
              <div className="filters-card__header">
                <h3 className="filters-card__title">Filters</h3>
                <button 
                  className="btn btn--secondary btn--small filters-card__reset-btn"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
              
              <form className="filters-card__form">
                <div className="filters-card__form-group">
                  <label htmlFor="search" className="form-label filters-card__label">Search</label>
                  <input
                    type="text"
                    id="search"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    className="form-control"
                    placeholder="Search tickets..."
                  />
                </div>
                
                <div className="filters-card__form-group">
                  <label htmlFor="status" className="form-label filters-card__label">Status</label>
                  <select
                    id="status"
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="form-control form-control--select"
                  >
                    <option value="">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
                
                <div className="filters-card__form-group">
                  <label htmlFor="priority" className="form-label filters-card__label">Priority</label>
                  <select
                    id="priority"
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="form-control form-control--select"
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div className="filters-card__form-group">
                  <label htmlFor="assignedTo" className="form-label filters-card__label">Assigned Agent</label>
                  <select
                    id="assignedTo"
                    name="assignedTo"
                    value={filters.assignedTo}
                    onChange={handleFilterChange}
                    className="form-control form-control--select"
                  >
                    <option value="">All Agents</option>
                    {tickets
                      .filter(ticket => ticket.assignedTo)
                      .map(ticket => ticket.assignedTo)
                      .filter((agent, index, self) => 
                        index === self.findIndex(a => a._id === agent._id)
                      )
                      .map(agent => (
                        <option key={agent._id} value={agent.name || 'Agent'}>
                          {agent.name || 'Agent'}
                        </option>
                      ))
                    }
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* Tickets Cards */}
          <div className="space-y-4">
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
              <div className="tickets-table__loading">
                <div className="spinner spinner--primary"></div>
                <p>Loading tickets...</p>
              </div>
            ) : (
              <>
                {currentTickets.length === 0 ? (
                  <div className="card">
                    <div className="card__body">
                      <div className="empty-state">
                        <div className="empty-state__icon-wrapper">
                          <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="empty-state__title">No tickets found</h3>
                        <p className="empty-state__description">
                          {filters.status || filters.priority || filters.agent || filters.search 
                            ? 'Try adjusting your filters' 
                            : 'No tickets available yet'}
                        </p>
                        {filters.status || filters.priority || filters.agent || filters.search ? (
                          <button className="btn btn--primary" onClick={resetFilters}>
                            Reset Filters
                          </button>
                        ) : (
                          <button 
                            className="btn btn--primary" 
                            onClick={() => navigate('/ticket/new')}
                          >
                            Create Ticket
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentTickets.map(ticket => (
                      <TicketCard key={ticket.id} ticket={ticket} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Pagination */}
          {!loading && !error && filteredTickets.length > 0 && (
            <div className="pagination">
              <div className="pagination__info">
                Showing {indexOfFirstTicket + 1}-{Math.min(indexOfLastTicket, filteredTickets.length)} of {filteredTickets.length} tickets
              </div>
              <div className="pagination__controls">
                <button 
                  className="btn btn--outline btn--small" 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span className="pagination__page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button 
                  className="btn btn--outline btn--small" 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tickets;