import { useState, useEffect, useCallback } from 'react';

const FilterSidebar = ({ 
  onFilterChange, 
  initialFilters = {},
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
  const [typesFilter, setTypesFilter] = useState('');
  const [sourcesFilter, setSourcesFilter] = useState('');
  const [tagsFilter, setTagsFilter] = useState('');
  const [companiesFilter, setCompaniesFilter] = useState('');
  const [contactsFilter, setContactsFilter] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // Applied filters for display
  const [appliedFilters, setAppliedFilters] = useState([]);

  // Status options
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ];

  // Priority options
  const priorityOptions = [
    { value: '', label: 'All Priority' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ];

  // Type options
  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'technical', label: 'Technical' },
    { value: 'billing', label: 'Billing' },
    { value: 'feature', label: 'Feature Request' }
  ];

  // Source options
  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'email', label: 'Email' },
    { value: 'web', label: 'Web' },
    { value: 'phone', label: 'Phone' },
    { value: 'chat', label: 'Chat' }
  ];

  // Update applied filters when any filter changes
  useEffect(() => {
    const filters = [];
    
    if (searchFields) filters.push({ name: 'Search', value: searchFields });
    if (createdDate) filters.push({ name: 'Created', value: createdDate });
    if (closedDate) filters.push({ name: 'Closed at', value: closedDate });
    if (resolvedDate) filters.push({ name: 'Resolved at', value: resolvedDate });
    if (resolutionDueDate) filters.push({ name: 'Resolution due by', value: resolutionDueDate });
    if (firstResponseDueDate) filters.push({ name: 'First response due by', value: firstResponseDueDate });
    if (statusFilter) filters.push({ name: 'Status', value: statusOptions.find(opt => opt.value === statusFilter)?.label || statusFilter });
    if (priorityFilter) filters.push({ name: 'Priority', value: priorityOptions.find(opt => opt.value === priorityFilter)?.label || priorityFilter });
    if (typesFilter) filters.push({ name: 'Type', value: typeOptions.find(opt => opt.value === typesFilter)?.label || typesFilter });
    if (sourcesFilter) filters.push({ name: 'Source', value: sourceOptions.find(opt => opt.value === sourcesFilter)?.label || sourcesFilter });
    if (tagsFilter) filters.push({ name: 'Tags', value: tagsFilter });
    if (companiesFilter) filters.push({ name: 'Company', value: companiesFilter });
    if (contactsFilter) filters.push({ name: 'Contact', value: contactsFilter });
    if (countryFilter) filters.push({ name: 'Country', value: countryFilter });
    if (categoryFilter) filters.push({ name: 'Category', value: categoryFilter });

    setAppliedFilters(filters);
  }, [searchFields, createdDate, closedDate, resolvedDate, resolutionDueDate, 
       firstResponseDueDate, statusFilter, priorityFilter, typesFilter, 
       sourcesFilter, tagsFilter, companiesFilter, contactsFilter, 
       countryFilter, categoryFilter]);

  // Handle filter changes and notify parent
  const handleFilterChange = useCallback(() => {
    const filters = {
      searchFields,
      createdDate,
      closedDate,
      resolvedDate,
      resolutionDueDate,
      firstResponseDueDate,
      statusFilter,
      priorityFilter,
      typesFilter,
      sourcesFilter,
      tagsFilter,
      companiesFilter,
      contactsFilter,
      countryFilter,
      categoryFilter
    };
    
    onFilterChange(filters);
  }, [searchFields, createdDate, closedDate, resolvedDate, resolutionDueDate, 
      firstResponseDueDate, statusFilter, priorityFilter, typesFilter, 
      sourcesFilter, tagsFilter, companiesFilter, contactsFilter, 
      countryFilter, categoryFilter, onFilterChange]);

  useEffect(() => {
    handleFilterChange();
  }, [handleFilterChange]);

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
    setTypesFilter('');
    setSourcesFilter('');
    setTagsFilter('');
    setCompaniesFilter('');
    setContactsFilter('');
    setCountryFilter('');
    setCategoryFilter('');
    
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // Remove a specific filter
  const removeFilter = (filterName) => {
    switch (filterName) {
      case 'Search':
        setSearchFields('');
        break;
      case 'Created':
        setCreatedDate('');
        break;
      case 'Closed at':
        setClosedDate('');
        break;
      case 'Resolved at':
        setResolvedDate('');
        break;
      case 'Resolution due by':
        setResolutionDueDate('');
        break;
      case 'First response due by':
        setFirstResponseDueDate('');
        break;
      case 'Status':
        setStatusFilter('');
        break;
      case 'Priority':
        setPriorityFilter('');
        break;
      case 'Type':
        setTypesFilter('');
        break;
      case 'Source':
        setSourcesFilter('');
        break;
      case 'Tags':
        setTagsFilter('');
        break;
      case 'Company':
        setCompaniesFilter('');
        break;
      case 'Contact':
        setContactsFilter('');
        break;
      case 'Country':
        setCountryFilter('');
        break;
      case 'Category':
        setCategoryFilter('');
        break;
      default:
        break;
    }
  };

  return (
    <div className="freshdesk-filter-sidebar">
      <div className="freshdesk-filter-header">
        <h3 className="freshdesk-filter-title">Filters</h3>
        <button className="freshdesk-filter-clear-btn" onClick={handleClearAllFilters}>
          Clear All
        </button>
      </div>

      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <div className="freshdesk-applied-filters">
          <h4 className="freshdesk-applied-filters-title">Applied Filters</h4>
          <div className="freshdesk-applied-filters-list">
            {appliedFilters.map((filter, index) => (
              <div key={index} className="freshdesk-applied-filter">
                <span className="freshdesk-applied-filter-name">{filter.name}:</span>
                <span className="freshdesk-applied-filter-value">{filter.value}</span>
                <button 
                  className="freshdesk-applied-filter-remove" 
                  onClick={() => removeFilter(filter.name)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Fields */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Search fields</label>
        <input
          type="text"
          className="freshdesk-filter-input sp-filter-search-fields"
          value={searchFields}
          onChange={(e) => setSearchFields(e.target.value)}
          placeholder="Search tickets..."
        />
      </div>

      {/* Date Filters */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Created</label>
        <input
          type="date"
          className="freshdesk-filter-input sp-filter-created-date"
          value={createdDate}
          onChange={(e) => setCreatedDate(e.target.value)}
        />
      </div>

      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Closed at</label>
        <input
          type="date"
          className="freshdesk-filter-input sp-filter-closed-date"
          value={closedDate}
          onChange={(e) => setClosedDate(e.target.value)}
        />
      </div>

      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Resolved at</label>
        <input
          type="date"
          className="freshdesk-filter-input sp-filter-resolved-date"
          value={resolvedDate}
          onChange={(e) => setResolvedDate(e.target.value)}
        />
      </div>

      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Resolution due by</label>
        <input
          type="date"
          className="freshdesk-filter-input sp-filter-resolution-due-date"
          value={resolutionDueDate}
          onChange={(e) => setResolutionDueDate(e.target.value)}
        />
      </div>

      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">First response due by</label>
        <input
          type="date"
          className="freshdesk-filter-input sp-filter-first-response-due-date"
          value={firstResponseDueDate}
          onChange={(e) => setFirstResponseDueDate(e.target.value)}
        />
      </div>

      {/* Status Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Status</label>
        <select
          className="freshdesk-filter-select sp-filter-status-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Priority Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Priority</label>
        <select
          className="freshdesk-filter-select sp-filter-priority-select"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          {priorityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Type Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Type</label>
        <select
          className="freshdesk-filter-select sp-filter-type-select"
          value={typesFilter}
          onChange={(e) => setTypesFilter(e.target.value)}
        >
          {typeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Source Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Source</label>
        <select
          className="freshdesk-filter-select sp-filter-source-select"
          value={sourcesFilter}
          onChange={(e) => setSourcesFilter(e.target.value)}
        >
          {sourceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tags Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Tags</label>
        <input
          type="text"
          className="freshdesk-filter-input sp-filter-tags-input"
          value={tagsFilter}
          onChange={(e) => setTagsFilter(e.target.value)}
          placeholder="Enter tags..."
        />
      </div>

      {/* Company Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Company</label>
        <input
          type="text"
          className="freshdesk-filter-input sp-filter-company-input"
          value={companiesFilter}
          onChange={(e) => setCompaniesFilter(e.target.value)}
          placeholder="Enter company..."
        />
      </div>

      {/* Contact Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Contact</label>
        <input
          type="text"
          className="freshdesk-filter-input sp-filter-contact-input"
          value={contactsFilter}
          onChange={(e) => setContactsFilter(e.target.value)}
          placeholder="Enter contact..."
        />
      </div>

      {/* Country Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Country</label>
        <input
          type="text"
          className="freshdesk-filter-input sp-filter-country-input"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          placeholder="Enter country..."
        />
      </div>

      {/* Category Filter */}
      <div className="freshdesk-filter-group">
        <label className="freshdesk-filter-label">Category</label>
        <input
          type="text"
          className="freshdesk-filter-input sp-filter-category-input"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          placeholder="Enter category..."
        />
      </div>
    </div>
  );
};

export default FilterSidebar;