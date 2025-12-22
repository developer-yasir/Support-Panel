import { useState, useEffect, useCallback } from 'react';

const FilterSidebar = ({
  onFilterChange,
  initialFilters = {},
  onClearFilters
}) => {
  // Filter states
  const [searchFields, setSearchFields] = useState('');
  const [agentsInclude, setAgentsInclude] = useState('');
  const [groupsInclude, setGroupsInclude] = useState('');
  const [createdDate, setCreatedDate] = useState('');
  const [closedDate, setClosedDate] = useState('');
  const [resolvedDate, setResolvedDate] = useState('');
  const [resolutionDueDate, setResolutionDueDate] = useState('');
  const [firstResponseDueDate, setFirstResponseDueDate] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Handle filter changes and notify parent
  const handleFilterChange = useCallback(() => {
    const filters = {
      searchFields,
      agentsInclude,
      groupsInclude,
      createdDate,
      closedDate,
      resolvedDate,
      resolutionDueDate,
      firstResponseDueDate,
      statusFilter,
      priorityFilter
    };

    onFilterChange(filters);
  }, [searchFields, agentsInclude, groupsInclude, createdDate, closedDate, resolvedDate,
    resolutionDueDate, firstResponseDueDate, statusFilter, priorityFilter, onFilterChange]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

  // Clear all filters
  const handleClearAllFilters = () => {
    setSearchFields('');
    setAgentsInclude('');
    setGroupsInclude('');
    setCreatedDate('');
    setClosedDate('');
    setResolvedDate('');
    setResolutionDueDate('');
    setFirstResponseDueDate('');
    setStatusFilter('');
    setPriorityFilter('');

    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className="p-4">
      {/* Search Fields */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          <svg className="w-3.5 h-3.5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search fields
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchFields}
          onChange={(e) => setSearchFields(e.target.value)}
          placeholder="Search tickets..."
        />
      </div>

      {/* Agents Include */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Agents Include</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={agentsInclude}
          onChange={(e) => setAgentsInclude(e.target.value)}
        >
          <option value="">Any agent</option>
          <option value="unassigned">Unassigned</option>
          <option value="me">Me</option>
        </select>
      </div>

      {/* Groups Include */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Groups Include</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={groupsInclude}
          onChange={(e) => setGroupsInclude(e.target.value)}
        >
          <option value="">Any group</option>
          <option value="customer_support">Customer Support</option>
          <option value="technical">Technical</option>
        </select>
      </div>

      {/* Created */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Created</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Closed at</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Resolved at</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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

      {/* Resolution due by */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Resolution due by</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
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

      {/* First response due by */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">First response due by</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={firstResponseDueDate}
          onChange={(e) => setFirstResponseDueDate(e.target.value)}
        >
          <option value="">Any time</option>
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="next_7_days">Next 7 days</option>
        </select>
      </div>

      {/* Status Include */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-2">Status Include</label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All unresolved</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleFilterChange}
        className="w-full px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors"
      >
        Apply
      </button>
    </div>
  );
};

export default FilterSidebar;