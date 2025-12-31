import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TicketListRow from '../components/TicketListRow';
import FilterSidebar from '../components/FilterSidebar';
import { useSidebar } from '../contexts/SidebarContext';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('latest');
  const [viewMode, setViewMode] = useState('card');
  const [filters, setFilters] = useState({});
  // Initialize filtersCollapsed from localStorage, default to true if not set
  const [filtersCollapsed, setFiltersCollapsed] = useState(() => {
    const saved = localStorage.getItem('ticketsFiltersCollapsed');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const [showAppliedFilters, setShowAppliedFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();

  // Persist filtersCollapsed state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ticketsFiltersCollapsed', JSON.stringify(filtersCollapsed));
  }, [filtersCollapsed]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await api.get('/tickets?populate=createdBy,assignedTo');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Handler for updating ticket priority
  const handlePriorityChange = async (ticketId, newPriority) => {
    try {
      await api.put(`/tickets/${ticketId}`, { priority: newPriority });
      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket._id === ticketId ? { ...ticket, priority: newPriority } : ticket
        )
      );
    } catch (error) {
      console.error('Error updating priority:', error);
      alert('Failed to update priority. Please try again.');
    }
  };

  // Handler for updating ticket assignment
  const handleAssignmentChange = async (ticketId, agentName) => {
    try {
      // For now, only support unassigning (setting to null)
      // Full assignment would require fetching actual user IDs from the backend
      if (agentName === null) {
        await api.put(`/tickets/${ticketId}`, { assignedTo: null });
        // Update local state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket._id === ticketId ? { ...ticket, assignedTo: null } : ticket
          )
        );
      } else {
        // For full assignment, we'd need to implement user lookup
        alert('Assignment feature coming soon! For now, you can only unassign tickets.');
      }
    } catch (error) {
      console.error('Error updating assignment:', error);
      alert('Failed to update assignment. Please try again.');
    }
  };

  // Handler for updating ticket status
  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await api.put(`/tickets/${ticketId}`, { status: newStatus });
      // Update local state
      setTickets(prevTickets =>
        prevTickets.map(ticket =>
          ticket._id === ticketId ? { ...ticket, status: newStatus } : ticket
        )
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };


  const filteredTickets = useMemo(() => {
    let filtered = [...tickets];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        (ticket.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ticket.createdBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply advanced filters from sidebar
    // Apply advanced filters from sidebar
    const {
      statusFilter, priorityFilter, searchFields,
      createdDate, closedDate, resolvedDate,
      resolutionDueDate, firstResponseDueDate,
      typeFilter, sourceFilter, tagsFilter,
      companiesFilter, contactsFilter, countryFilter, categoryFilter,
      agentsFilter, groupsFilter
    } = filters;

    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (searchFields) {
      const searchLower = searchFields.toLowerCase();
      filtered = filtered.filter(ticket =>
        (ticket.title || '').toLowerCase().includes(searchLower) ||
        (ticket.description || '').toLowerCase().includes(searchLower)
      );
    }

    // Helper for date filtering
    const checkPastDateFilter = (dateString, filterType) => {
      if (!dateString || !filterType) return true;
      const date = new Date(dateString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filterType) {
        case 'today':
          return date >= today;
        case 'yesterday':
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          const todayStart = new Date(today);
          return date >= yesterday && date < todayStart;
        case 'last_7_days':
          const last7Days = new Date(today);
          last7Days.setDate(last7Days.getDate() - 7);
          return date >= last7Days;
        case 'last_30_days':
          const last30Days = new Date(today);
          last30Days.setDate(last30Days.getDate() - 30);
          return date >= last30Days;
        default:
          return true;
      }
    };

    // Helper for future date filtering (Due dates)
    const checkFutureDateFilter = (dateString, filterType) => {
      if (!dateString || !filterType) return true;
      const date = new Date(dateString);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      switch (filterType) {
        case 'overdue':
          return date < now;
        case 'today':
          return date >= today && date < new Date(today.getTime() + 86400000);
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return date >= tomorrow && date < new Date(tomorrow.getTime() + 86400000);
        case 'next_7_days':
          const next7Days = new Date(today);
          next7Days.setDate(next7Days.getDate() + 7);
          return date >= today && date <= next7Days;
        default:
          return true;
      }
    };

    if (createdDate) {
      filtered = filtered.filter(ticket => checkPastDateFilter(ticket.createdAt, createdDate));
    }

    if (closedDate) {
      filtered = filtered.filter(ticket => checkPastDateFilter(ticket.updatedAt, closedDate) && ticket.status === 'closed');
    }

    if (resolvedDate) {
      // Using updatedAt generally correlates with resolution time for resolved tickets
      filtered = filtered.filter(ticket => checkPastDateFilter(ticket.updatedAt, resolvedDate) && ticket.status === 'resolved');
    }

    if (resolutionDueDate) {
      filtered = filtered.filter(ticket => checkFutureDateFilter(ticket.dueDate, resolutionDueDate));
    }

    // New Fields Mapping
    if (typeFilter) {
      // Schema uses Capitalized ('Question'), Filter uses lowercase ('question')
      filtered = filtered.filter(ticket => (ticket.type || '').toLowerCase() === typeFilter.toLowerCase());
    }
    if (sourceFilter) {
      // Schema uses Capitalized ('Email'), Filter uses lowercase ('email')
      filtered = filtered.filter(ticket => (ticket.source || '').toLowerCase() === sourceFilter.toLowerCase());
    }

    // Contacts Filter -> Search in createdBy.name
    if (contactsFilter) {
      const contactLower = contactsFilter.toLowerCase();
      filtered = filtered.filter(ticket => (ticket.createdBy?.name || '').toLowerCase().includes(contactLower));
    }

    // Companies Filter -> Search in createdBy.company (if populated) or just companyId if text
    if (companiesFilter) {
      const companyLower = companiesFilter.toLowerCase();
      filtered = filtered.filter(ticket =>
        (ticket.createdBy?.company || '').toLowerCase().includes(companyLower)
      );
    }

    // Tags - Check if tags exist (likely not in current schema but safe to add)
    if (tagsFilter) {
      const tagLower = tagsFilter.toLowerCase();
      filtered = filtered.filter(ticket => (ticket.tags || []).some(tag => tag.toLowerCase().includes(tagLower)));
    }

    // Agents Filter - Search in assignedTo
    if (agentsFilter) {
      const agentLower = agentsFilter.toLowerCase();
      filtered = filtered.filter(ticket =>
        (ticket.assignedTo?.name || ticket.assignedTo || '').toString().toLowerCase().includes(agentLower)
      );
    }

    // Groups Filter - Search in group
    if (groupsFilter) {
      const groupLower = groupsFilter.toLowerCase();
      filtered = filtered.filter(ticket =>
        (ticket.group?.name || ticket.group || '').toString().toLowerCase().includes(groupLower)
      );
    }


    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'latest':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [tickets, searchTerm, sortOption, filters]);

  // Paginate the filtered tickets
  const paginatedTickets = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTickets.slice(startIndex, endIndex);
  }, [filteredTickets, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startItem = filteredTickets.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, filteredTickets.length);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSelectAll = () => {
    if (selectedTickets.size === filteredTickets.length) {
      setSelectedTickets(new Set());
    } else {
      setSelectedTickets(new Set(filteredTickets.map(t => t._id)));
    }
  };

  const handleSelectTicket = (ticketId) => {
    const newSelected = new Set(selectedTickets);
    if (newSelected.has(ticketId)) {
      newSelected.delete(ticketId);
    } else {
      newSelected.add(ticketId);
    }
    setSelectedTickets(newSelected);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <Navbar />

      {/* Main Content - with responsive margins for sidebar and navbar */}
      <div
        className="transition-all duration-300"
        style={{ marginLeft: isCollapsed ? '69px' : '265px' }}
      >
        {/* Top Bar - positioned below the fixed navbar */}
        <div
          className={`bg-white border-b border-gray-200 px-4 md:px-6 sticky top-[64px] z-10 transition-all duration-300 h-[55px] flex items-center`}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 w-full">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                {filters.statusFilter ? (
                  <>
                    All {filters.statusFilter === 'in_progress' ? 'In Progress' : filters.statusFilter.charAt(0).toUpperCase() + filters.statusFilter.slice(1)} Tickets
                  </>
                ) : (
                  'All Tickets'
                )}
                <span className="ml-1 text-sm font-normal text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">{filteredTickets.length}</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Sort Dropdown */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="latest">Date created</option>
                <option value="oldest">Oldest first</option>
                <option value="priority">Priority</option>
              </select>

              {/* View Toggle - Hidden on mobile */}
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="hidden md:block px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors cursor-pointer"
              >
                <option value="card">Card view</option>
                <option value="list">List view</option>
              </select>

              {/* Export Button - Hidden on mobile */}
              <button className="hidden md:flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export
              </button>

              {/* Filters Toggle */}
              <button
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-md text-sm transition-colors ${!filtersCollapsed
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filters</span>
                {Object.keys(filters).length > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                    {Object.keys(filters).length}
                  </span>
                )}
              </button>

              {/* Pagination */}
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 border-l border-gray-200 pl-3 ml-1">
                <span>{startItem} - {endItem} of {filteredTickets.length}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || filteredTickets.length === 0}
                    className="p-1.5 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area with Flex Layout */}
        <div className="relative min-h-[calc(100vh-128px)]" style={{ top: '70px' }}>
          {/* Tickets List */}
          <div
            className="bg-white pt-3"
            style={{
              marginRight: filtersCollapsed ? '0' : '320px',
              transition: 'margin-right 500ms ease-in-out'
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading tickets...</p>
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No tickets found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div>
                {paginatedTickets.map(ticket => (
                  <TicketListRow
                    key={ticket._id}
                    ticket={ticket}
                    isSelected={selectedTickets.has(ticket._id)}
                    onSelect={() => handleSelectTicket(ticket._id)}
                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                    onPriorityChange={handlePriorityChange}
                    onAssignmentChange={handleAssignmentChange}
                    onStatusChange={handleStatusChange}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Filter Sidebar - Fixed to the right */}
          {!filtersCollapsed && (
            <div
              className={`fixed right-0 bg-white border-l border-gray-200 shadow-lg z-20 transition-all duration-300 flex flex-col ${filtersCollapsed ? 'translate-x-full' : 'translate-x-0'}`}
              style={{
                top: '128px', // Below navbar (64px) + top bar (64px)
                width: '320px',
                height: 'calc(100vh - 128px)'
              }}
            >
              <div
                className="border-b border-gray-100 bg-white z-10 flex-none"
                style={{ padding: '15px 15px 5px 15px' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">Filters</h3>
                  <button
                    className={`text-xs font-medium ${Object.keys(filters).length > 0 ? 'text-indigo-600 hover:text-indigo-700' : 'text-gray-400 cursor-not-allowed'}`}
                    disabled={Object.keys(filters).length === 0}
                    onClick={() => setShowAppliedFilters(!showAppliedFilters)}
                  >
                    {showAppliedFilters ? 'Hide' : 'Show'} applied filters ({Object.keys(filters).length})
                  </button>
                </div>

                {/* Active Filters Chips */}
                {showAppliedFilters && Object.keys(filters).length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2 p-2 bg-white rounded border border-gray-200">
                    {Object.entries(filters).map(([key, value]) => (
                      <span key={key} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        <span className="capitalize mr-1.5">{key.replace(/Filter$/, '').replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="truncate max-w-[100px]">{String(value)}</span>
                        <button
                          onClick={() => {
                            const newFilters = { ...filters };
                            delete newFilters[key];
                            handleFilterChange(newFilters);
                          }}
                          className="ml-1.5 text-indigo-400 hover:text-indigo-600 focus:outline-none"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={handleClearFilters}
                      className="text-xs text-gray-500 hover:text-indigo-600 underline decoration-dotted underline-offset-2 ml-1"
                    >
                      Clear all
                    </button>
                  </div>
                )}
              </div>
              {/* Search is handled inside FilterSidebar, so we just keep the header clean */}
              <div className="flex-1 overflow-hidden relative">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                />
              </div>

            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default Tickets;
