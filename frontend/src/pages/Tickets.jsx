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
  const [filtersCollapsed, setFiltersCollapsed] = useState(true);
  const [selectedTickets, setSelectedTickets] = useState(new Set());
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();

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
    const { statusFilter, priorityFilter, searchFields } = filters;

    if (statusFilter) {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(ticket => ticket.priority === priorityFilter);
    }

    if (searchFields) {
      filtered = filtered.filter(ticket =>
        (ticket.title || '').toLowerCase().includes(searchFields.toLowerCase()) ||
        (ticket.description || '').toLowerCase().includes(searchFields.toLowerCase())
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
        className="transition-all duration-300 mt-16"
        style={{ marginLeft: isCollapsed ? '69px' : '265px' }}
      >
        {/* Top Bar - positioned below the fixed navbar */}
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-3 sticky top-[64px] z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-4">
              <h1 className="text-sm md:text-base font-medium text-gray-900 flex items-center gap-2">
                <svg className="w-4 h-4 hidden md:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                All unresolved tickets
                <span className="ml-1 text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{filteredTickets.length}</span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2 text-xs md:text-sm">
                <span className="text-gray-600 hidden md:inline">Sort by:</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="latest">Date created ▼</option>
                  <option value="oldest">Oldest first</option>
                  <option value="priority">Priority</option>
                </select>
              </div>

              {/* View Toggle - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 text-xs md:text-sm">
                <span className="text-gray-600 hidden lg:inline">Layout:</span>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  <option value="card">Card ▼</option>
                  <option value="list">List</option>
                </select>
              </div>

              {/* Export Button - Hidden on mobile */}
              <button className="hidden md:flex items-center gap-2 px-3 py-2 border border-gray-300 rounded hover:bg-gray-50 text-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden lg:inline">Export</span>
              </button>

              {/* Filters Toggle */}
              <button
                onClick={() => setFiltersCollapsed(!filtersCollapsed)}
                className={`flex items-center gap-2 px-3 py-2 border rounded text-sm transition-colors ${!filtersCollapsed ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'border-gray-300 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span className="hidden sm:inline">Filters</span> ({Object.keys(filters).length})
              </button>

              {/* Pagination - Hidden on mobile */}
              <div className="hidden md:flex items-center gap-2 text-xs text-gray-600">
                <span>1 - 9 of {filteredTickets.length}</span>
                <div className="flex gap-1">
                  <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded">
                    <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded">
                    <svg className="w-3 md:w-4 h-3 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative">
          {/* Tickets List */}
          <div className={`transition-all bg-white ${filtersCollapsed ? '' : 'mr-80'}`}>
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
                {filteredTickets.map(ticket => (
                  <TicketListRow
                    key={ticket._id}
                    ticket={ticket}
                    isSelected={selectedTickets.has(ticket._id)}
                    onSelect={() => handleSelectTicket(ticket._id)}
                    onClick={() => navigate(`/ticket/${ticket._id}`)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Filter Sidebar */}
          {!filtersCollapsed && (
            <div className="fixed right-0 top-16 w-80 h-[calc(100vh-64px)] bg-white border-l border-gray-200 overflow-y-auto shadow-lg z-20">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase">Filters</h3>
                <button
                  className="text-indigo-600 text-xs hover:text-indigo-700"
                  onClick={handleClearFilters}
                >
                  Show applied filters
                </button>
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
