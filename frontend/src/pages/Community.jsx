import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Community = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const discussionsPerPage = 10;
  const navigate = useNavigate();

  // Mock data for community discussions
  useEffect(() => {
    const fetchDiscussions = async () => {
      try {
        setLoading(true);
        // In a real app, this would come from an API
        const mockDiscussions = [
          { id: 1, title: 'Feature request: Dark mode for all panels', category: 'Feature Requests', type: 'idea', author: 'John Smith', date: '2023-06-15', replies: 24, views: 156, status: 'considering' },
          { id: 2, title: 'How to integrate with third-party tools?', category: 'Questions', type: 'question', author: 'Alice Johnson', date: '2023-06-14', replies: 8, views: 89, status: 'open' },
          { id: 3, title: 'Bug: Dashboard not loading on mobile', category: 'Technical Issues', type: 'issue', author: 'Bob Wilson', date: '2023-06-13', replies: 12, views: 203, status: 'investigating' },
          { id: 4, title: 'Best practices for team collaboration', category: 'Ideas', type: 'idea', author: 'Emma Davis', date: '2023-06-12', replies: 5, views: 76, status: 'implemented' },
          { id: 5, title: 'Mobile app crashes during file upload', category: 'Technical Issues', type: 'issue', author: 'Mike Brown', date: '2023-06-11', replies: 18, views: 189, status: 'fixed' },
          { id: 6, title: 'Suggestion: Bulk email notifications', category: 'Feature Requests', type: 'idea', author: 'Sarah Taylor', date: '2023-06-10', replies: 15, views: 124, status: 'planned' },
          { id: 7, title: 'API documentation questions', category: 'Questions', type: 'question', author: 'David Miller', date: '2023-06-09', replies: 7, views: 95, status: 'answered' },
          { id: 8, title: 'Integration with popular CRM systems', category: 'Feature Requests', type: 'idea', author: 'Lisa Anderson', date: '2023-06-08', replies: 32, views: 256, status: 'under review' },
          { id: 9, title: 'Performance optimization tips', category: 'Ideas', type: 'idea', author: 'James Wilson', date: '2023-06-07', replies: 9, views: 112, status: 'solved' },
          { id: 10, title: 'Two-factor authentication setup', category: 'Questions', type: 'question', author: 'Olivia Johnson', date: '2023-06-06', replies: 6, views: 87, status: 'answered' },
        ];
        setDiscussions(mockDiscussions);
      } catch (err) {
        setError('Failed to fetch community discussions');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscussions();
  }, []);

  // Filter discussions based on search term, category and type
  const filteredDiscussions = discussions.filter(discussion => {
    const matchesSearch = searchTerm === '' || 
      discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
      discussion.category === selectedCategory;
    
    const matchesType = selectedType === '' || 
      discussion.type === selectedType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  // Pagination
  const indexOfLastDiscussion = currentPage * discussionsPerPage;
  const indexOfFirstDiscussion = indexOfLastDiscussion - discussionsPerPage;
  const currentDiscussions = filteredDiscussions.slice(indexOfFirstDiscussion, indexOfLastDiscussion);
  const totalPages = Math.ceil(filteredDiscussions.length / discussionsPerPage);

  const getTypeBadgeClass = (type) => {
    switch (type) {
      case 'question': return 'badge badge-info';
      case 'idea': return 'badge badge-warning';
      case 'issue': return 'badge badge-danger';
      default: return 'badge badge-secondary';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'open': return 'badge badge-success';
      case 'answered': return 'badge badge-success';
      case 'solved': return 'badge badge-success';
      case 'fixed': return 'badge badge-success';
      case 'implemented': return 'badge badge-success';
      case 'considering': return 'badge badge-warning';
      case 'under review': return 'badge badge-warning';
      case 'investigating': return 'badge badge-warning';
      case 'planned': return 'badge badge-primary';
      default: return 'badge badge-secondary';
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedType('');
    setCurrentPage(1);
  };

  return (
    <div className="community">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Community
                </h1>
                <p className="dashboard-header__subtitle">Connect with other users and share ideas</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/community/new')}
                  className="btn btn--primary dashboard-header__create-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  New Discussion
                </button>
              </div>
            </div>
          </div>

          <div className="community__container">
            {/* Search and Filters */}
            <div className="card community__search-card">
              <div className="card__body">
                <div className="community__search-header">
                  <h2 className="community__search-title">Find discussions</h2>
                  <p className="community__search-subtitle">Ask questions, share ideas, or report issues</p>
                </div>
                
                <div className="community__search-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="form-control"
                      placeholder="Search discussions..."
                    />
                  </div>
                  
                  <div className="community__filters">
                    <div className="form-group">
                      <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="form-control form-control--select"
                      >
                        <option value="">All Categories</option>
                        <option value="Questions">Questions</option>
                        <option value="Feature Requests">Feature Requests</option>
                        <option value="Technical Issues">Technical Issues</option>
                        <option value="Ideas">Ideas</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <select
                        value={selectedType}
                        onChange={handleTypeChange}
                        className="form-control form-control--select"
                      >
                        <option value="">All Types</option>
                        <option value="question">Questions</option>
                        <option value="idea">Ideas</option>
                        <option value="issue">Issues</option>
                      </select>
                    </div>
                    
                    <button 
                      className="btn btn--secondary btn--small"
                      onClick={resetFilters}
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Discussions List */}
            <div className="community__discussions">
              <div className="community__discussions-header">
                <h2 className="community__discussions-title">
                  {searchTerm || selectedCategory || selectedType ? `Search Results` : `Recent Discussions`}
                  <span className="community__discussions-count">({filteredDiscussions.length})</span>
                </h2>
              </div>

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
                <div className="community__loading">
                  <div className="spinner spinner--primary"></div>
                  <p>Loading discussions...</p>
                </div>
              ) : (
                <>
                  <div className="community__discussions-list">
                    {currentDiscussions.map(discussion => (
                      <div 
                        key={discussion.id} 
                        className="card community__discussion-card"
                        onClick={() => navigate(`/community/${discussion.id}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="card__body">
                          <div className="community__discussion-main">
                            <div className="community__discussion-type">
                              <span className={getTypeBadgeClass(discussion.type)}>
                                {discussion.type.toUpperCase()}
                              </span>
                              <span className={getStatusBadgeClass(discussion.status)}>
                                {discussion.status.replace(' ', '-').toUpperCase()}
                              </span>
                            </div>
                            <h3 className="community__discussion-title">{discussion.title}</h3>
                            <div className="community__discussion-meta">
                              <span className="community__discussion-author">By {discussion.author}</span>
                              <span className="community__discussion-date">{new Date(discussion.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                          
                          <div className="community__discussion-sidebar">
                            <div className="community__discussion-stats">
                              <div className="community__discussion-stat">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <span>{discussion.replies}</span>
                              </div>
                              <div className="community__discussion-stat">
                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="16" height="16">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                <span>{discussion.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {!loading && !error && filteredDiscussions.length > 0 && (
                    <div className="pagination">
                      <div className="pagination__info">
                        Showing {indexOfFirstDiscussion + 1}-{Math.min(indexOfLastDiscussion, filteredDiscussions.length)} of {filteredDiscussions.length} discussions
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
                </>
              )}

              {currentDiscussions.length === 0 && !loading && !error && (
                <div className="empty-state">
                  <div className="empty-state__icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="empty-state__title">No discussions found</h3>
                  <p className="empty-state__description">
                    {searchTerm || selectedCategory || selectedType 
                      ? 'Try adjusting your search or filters' 
                      : 'No discussions available yet'}
                  </p>
                  {(searchTerm || selectedCategory || selectedType) ? (
                    <button className="btn btn--primary" onClick={resetFilters}>
                      Reset Filters
                    </button>
                  ) : (
                    <button 
                      className="btn btn--primary" 
                      onClick={() => navigate('/community/new')}
                    >
                      Start Discussion
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;