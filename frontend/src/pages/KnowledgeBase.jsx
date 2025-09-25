import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const KnowledgeBase = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  // Mock data for knowledge base
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // In a real app, these would come from an API
        const mockCategories = [
          { id: 1, name: 'Getting Started', count: 5 },
          { id: 2, name: 'Account Management', count: 8 },
          { id: 3, name: 'Billing & Payments', count: 6 },
          { id: 4, name: 'Technical Support', count: 12 },
          { id: 5, name: 'Features & Tools', count: 7 },
        ];
        
        const mockArticles = [
          { id: 1, title: 'How to create an account', category: 'Getting Started', excerpt: 'Learn how to create a new account and verify your email.', date: '2023-05-15', views: 1245 },
          { id: 2, title: 'Changing your password', category: 'Account Management', excerpt: 'Step-by-step guide to update your account password.', date: '2023-05-20', views: 987 },
          { id: 3, title: 'Updating payment information', category: 'Billing & Payments', excerpt: 'How to securely update your payment methods.', date: '2023-06-01', views: 856 },
          { id: 4, title: 'Troubleshooting login issues', category: 'Technical Support', excerpt: 'Common solutions for login problems.', date: '2023-06-05', views: 1423 },
          { id: 5, title: 'Using the dashboard', category: 'Features & Tools', excerpt: 'Navigate and customize your dashboard experience.', date: '2023-06-10', views: 765 },
          { id: 6, title: 'Managing user permissions', category: 'Account Management', excerpt: 'Control access for your team members.', date: '2023-06-12', views: 632 },
          { id: 7, title: 'Setting up API access', category: 'Technical Support', excerpt: 'Securely connect external applications.', date: '2023-06-15', views: 543 },
          { id: 8, title: 'Creating custom reports', category: 'Features & Tools', excerpt: 'Generate reports tailored to your needs.', date: '2023-06-18', views: 421 },
          { id: 9, title: 'Subscription and billing FAQ', category: 'Billing & Payments', excerpt: 'Answers to common billing questions.', date: '2023-06-20', views: 987 },
          { id: 10, title: 'Data security and privacy', category: 'Getting Started', excerpt: 'Understanding our security measures.', date: '2023-06-22', views: 1102 },
          { id: 11, title: 'Bulk import contacts', category: 'Features & Tools', excerpt: 'Efficiently add multiple contacts at once.', date: '2023-06-25', views: 456 },
          { id: 12, title: 'Troubleshooting mobile app', category: 'Technical Support', excerpt: 'Common issues and solutions for mobile.', date: '2023-06-28', views: 789 },
        ];
        
        setCategories(mockCategories);
        setArticles(mockArticles);
      } catch (err) {
        setError('Failed to fetch knowledge base data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter articles based on search term and category
  const filteredArticles = articles.filter(article => {
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || 
      article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setCurrentPage(1);
  };

  return (
    <div className="knowledge-base">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Knowledge Base
                </h1>
                <p className="dashboard-header__subtitle">Self-service support articles and guides</p>
              </div>
              <div className="dashboard-header__actions">
                <button
                  onClick={() => navigate('/knowledge-base/new')}
                  className="btn btn--primary dashboard-header__create-btn"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Create Article
                </button>
              </div>
            </div>
          </div>

          <div className="knowledge-base__container">
            {/* Search and Filters */}
            <div className="card knowledge-base__search-card">
              <div className="card__body">
                <div className="knowledge-base__search-header">
                  <h2 className="knowledge-base__search-title">Find answers to common questions</h2>
                  <p className="knowledge-base__search-subtitle">Browse our collection of how-to guides, tips, and solutions</p>
                </div>
                
                <div className="knowledge-base__search-form">
                  <div className="form-group">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={handleSearch}
                      className="form-control"
                      placeholder="Search articles..."
                    />
                  </div>
                  
                  <div className="knowledge-base__filters">
                    <div className="form-group">
                      <select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        className="form-control form-control--select"
                      >
                        <option value="">All Categories</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>{category.name}</option>
                        ))}
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
                
                <div className="knowledge-base__categories">
                  <h3 className="knowledge-base__categories-title">Popular Categories</h3>
                  <div className="knowledge-base__categories-grid">
                    {categories.map(category => (
                      <div 
                        key={category.id} 
                        className="knowledge-base__category-item"
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setCurrentPage(1);
                        }}
                      >
                        <div className="knowledge-base__category-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="24" height="24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <h4 className="knowledge-base__category-name">{category.name}</h4>
                        <p className="knowledge-base__category-count">{category.count} articles</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Articles List */}
            <div className="knowledge-base__articles">
              <div className="knowledge-base__articles-header">
                <h2 className="knowledge-base__articles-title">
                  {searchTerm || selectedCategory ? `Search Results` : `All Articles`}
                  <span className="knowledge-base__articles-count">({filteredArticles.length})</span>
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
                <div className="knowledge-base__loading">
                  <div className="spinner spinner--primary"></div>
                  <p>Loading articles...</p>
                </div>
              ) : (
                <>
                  <div className="knowledge-base__articles-grid">
                    {currentArticles.map(article => (
                      <div key={article.id} className="card knowledge-base__article-card">
                        <div className="card__body">
                          <div className="knowledge-base__article-category">
                            <span className="badge badge--primary">{article.category}</span>
                          </div>
                          <h3 className="knowledge-base__article-title" onClick={() => navigate(`/knowledge-base/${article.id}`)}>
                            {article.title}
                          </h3>
                          <p className="knowledge-base__article-excerpt">{article.excerpt}</p>
                          <div className="knowledge-base__article-meta">
                            <span className="knowledge-base__article-date">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {new Date(article.date).toLocaleDateString()}
                            </span>
                            <span className="knowledge-base__article-views">
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="14" height="14">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              {article.views} views
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {!loading && !error && filteredArticles.length > 0 && (
                    <div className="pagination">
                      <div className="pagination__info">
                        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredArticles.length)} of {filteredArticles.length} articles
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

              {currentArticles.length === 0 && !loading && !error && (
                <div className="empty-state">
                  <div className="empty-state__icon-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" className="empty-state__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="48" height="48">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="empty-state__title">No articles found</h3>
                  <p className="empty-state__description">
                    {searchTerm || selectedCategory 
                      ? 'Try adjusting your search or category filter' 
                      : 'No articles available yet'}
                  </p>
                  {(searchTerm || selectedCategory) ? (
                    <button className="btn btn--primary" onClick={resetFilters}>
                      Reset Filters
                    </button>
                  ) : (
                    <button 
                      className="btn btn--primary" 
                      onClick={() => navigate('/knowledge-base/new')}
                    >
                      Create Article
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

export default KnowledgeBase;