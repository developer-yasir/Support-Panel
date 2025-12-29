import { useState, useEffect, useCallback } from 'react';

// Minimalist Collapsible Section
const FilterSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full py-4 px-1 group focus:outline-none"
      >
        <span className="text-xs font-semibold text-gray-900 uppercase tracking-wide group-hover:text-indigo-600 transition-colors">
          {title}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
      >
        <div className="space-y-4 px-1">
          {children}
        </div>
      </div>
    </div>
  );
};

const FilterSidebar = ({
  onFilterChange,
  initialFilters = {},
  filters = {}, // Receive current filters from parent
  onClearFilters
}) => {
  // Filter states
  const [searchFields, setSearchFields] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [closedDate, setClosedDate] = useState('');
  const [resolvedDate, setResolvedDate] = useState('');
  const [resolutionDueDate, setResolutionDueDate] = useState('');
  const [firstResponseDueDate, setFirstResponseDueDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // New filters
  const [typeFilter, setTypeFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [companiesFilter, setCompaniesFilter] = useState('');
  const [contactsFilter, setContactsFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  const [categoryFilter, setCategoryFilter] = useState('');
  const [agentsFilter, setAgentsFilter] = useState('');
  const [groupsFilter, setGroupsFilter] = useState('');

  // Sync state with props when filters change (e.g. on clear)
  useEffect(() => {
    setSearchFields(filters.searchFields || '');
    setCreatedDate(filters.createdDate || '');
    setClosedDate(filters.closedDate || '');
    setResolvedDate(filters.resolvedDate || '');
    setResolutionDueDate(filters.resolutionDueDate || '');
    setFirstResponseDueDate(filters.firstResponseDueDate || '');
    setStatusFilter(filters.statusFilter || '');
    setPriorityFilter(filters.priorityFilter || '');

    // Sync new filters
    setTypeFilter(filters.typeFilter || '');
    setSourceFilter(filters.sourceFilter || '');
    setTagsFilter(filters.tagsFilter || '');
    setCompaniesFilter(filters.companiesFilter || '');
    setContactsFilter(filters.contactsFilter || '');
    setCountryFilter(filters.countryFilter || '');
    setCategoryFilter(filters.categoryFilter || '');
    setAgentsFilter(filters.agentsFilter || '');
    setGroupsFilter(filters.groupsFilter || '');
  }, [filters]);

  // Handle filter changes and notify parent (On Apply Click)
  const handleFilterChange = () => {
    const activeFilters = {};
    const possibleFilters = {
      searchFields, createdDate, closedDate, resolvedDate,
      resolutionDueDate, firstResponseDueDate, statusFilter,
      priorityFilter, typeFilter, agentsFilter, groupsFilter,
      sourceFilter, tagsFilter, companiesFilter, contactsFilter,
      countryFilter, categoryFilter
    };

    // Only include filters that have values
    Object.entries(possibleFilters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        activeFilters[key] = value;
      }
    });

    onFilterChange(activeFilters);
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchFields('');
    setCreatedDate('');
    setClosedDate('');
    setResolvedDate('');
    setResolutionDueDate('');
    setFirstResponseDueDate('');
    setStatusFilter('');
    setPriorityFilter('');
    setTypeFilter('');
    setSourceFilter('');
    setTagsFilter('');
    setCompaniesFilter('');
    setContactsFilter('');
    setCountryFilter('');
    setCategoryFilter('');

    if (onClearFilters) {
      onClearFilters();
    }
    // Also explicitly trigger update to clear parent
    onFilterChange({});
  };

  return (
    <div className="flex flex-col h-full relative bg-white border-l border-gray-200">
      <div className="flex-1 overflow-y-auto px-5 py-2 scroller-thin pb-24">

        {/* Search - Always visible/top */}
        <div className="py-4 border-b border-gray-100">
          <div className="relative">
            <input
              type="text"
              className="w-full pr-3 py-2 text-sm bg-gray-50 border-0 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 text-gray-700 placeholder-gray-400 transition-all"
              style={{ paddingLeft: '2.75rem' }}
              value={searchFields}
              onChange={(e) => setSearchFields(e.target.value)}
              placeholder="Search filters..."
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* ASSIGNMENT */}
        <FilterSection title="Assignment" defaultOpen={true}>
          {/* Agents */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Agent</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 transition-colors"
              value={agentsFilter}
              onChange={(e) => setAgentsFilter(e.target.value)}
              placeholder="Search agent..."
            />
          </div>

          {/* Groups */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Group</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 transition-colors"
              value={groupsFilter}
              onChange={(e) => setGroupsFilter(e.target.value)}
              placeholder="Search group..."
            />
          </div>
        </FilterSection>

        {/* DATE & TIME */}
        <FilterSection title="Time Period">
          <div className="grid grid-cols-1 gap-4">
            {/* Created */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Created</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
                value={createdDate}
                onChange={(e) => setCreatedDate(e.target.value)}
              >
                <option value="">Any time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
              </select>
            </div>

            {/* Closed at */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Closed</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
                value={closedDate}
                onChange={(e) => setClosedDate(e.target.value)}
              >
                <option value="">Any time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
              </select>
            </div>

            {/* Resolved at */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Resolved</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
                value={resolvedDate}
                onChange={(e) => setResolvedDate(e.target.value)}
              >
                <option value="">Any time</option>
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="last_7_days">Last 7 days</option>
                <option value="last_30_days">Last 30 days</option>
              </select>
            </div>

            {/* Due Dates */}
            <div>
              <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Resolution Due</label>
              <select
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
                value={resolutionDueDate}
                onChange={(e) => setResolutionDueDate(e.target.value)}
              >
                <option value="">Any time</option>
                <option value="overdue">Overdue</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="next_7_days">Next 7 days</option>
              </select>
            </div>
          </div>
        </FilterSection>

        {/* PROPERTIES */}
        <FilterSection title="Properties" defaultOpen={true}>
          {/* Status */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Status</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All unresolved</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Priority</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">Any priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Type</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="">Any type</option>
              <option value="question">Question</option>
              <option value="incident">Incident</option>
              <option value="problem">Problem</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Source</label>
            <select
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 bg-white"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
            >
              <option value="">Any source</option>
              <option value="email">Email</option>
              <option value="portal">Portal</option>
              <option value="phone">Phone</option>
              <option value="chat">Chat</option>
            </select>
          </div>
        </FilterSection>

        {/* DETAILS */}
        <FilterSection title="Details">
          {/* Tags */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Tags</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 transition-colors"
              value={tagsFilter}
              onChange={(e) => setTagsFilter(e.target.value)}
              placeholder="Enter tags..."
            />
          </div>

          {/* Companies */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Company</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 transition-colors"
              value={companiesFilter}
              onChange={(e) => setCompaniesFilter(e.target.value)}
              placeholder="Search..."
            />
          </div>

          {/* Contacts */}
          <div>
            <label className="block text-[11px] font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Contact</label>
            <input
              type="text"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:border-indigo-500 focus:ring-0 transition-colors"
              value={contactsFilter}
              onChange={(e) => setContactsFilter(e.target.value)}
              placeholder="Search..."
            />
          </div>
        </FilterSection>
      </div>

      {/* Sticky Apply Button */}
      {/* Floating Apply Button Area */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 z-10 flex justify-center items-center">
        <button
          onClick={handleFilterChange}
          className="w-[120px] h-[33px] text-[17px] bg-[#4c5d72] hover:bg-[#3b4859] text-white font-semibold rounded shadow-sm transition-colors flex items-center justify-center"
        >
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;