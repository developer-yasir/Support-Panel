import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

const CompanyCreation = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    billingEmail: '',
    contactEmail: ''
    // plan is now set in settings, default is free
  });
  
  const [availabilityCheck, setAvailabilityCheck] = useState({
    subdomain: null,
    checking: false
  });
  
  const [setupInfo, setSetupInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Fetch setup info on component mount
  useEffect(() => {
    const fetchSetupInfo = async () => {
      try {
        const response = await api.get('/companies/setup-info');
        setSetupInfo(response.data);
      } catch (error) {
        console.error('Error fetching setup info:', error);
      }
    };

    fetchSetupInfo();
  }, []);

  // Handle subdomain availability check with debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.subdomain.length >= 3) {
        checkSubdomainAvailability(formData.subdomain);
      } else {
        setAvailabilityCheck({ subdomain: null, checking: false });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formData.subdomain]);

  const checkSubdomainAvailability = async (subdomain) => {
    setAvailabilityCheck({ ...availabilityCheck, checking: true });
    try {
      const response = await api.get(`/companies/check-subdomain/${subdomain}`);
      setAvailabilityCheck({ subdomain: response.data.available, checking: false });
    } catch (error) {
      console.error('Error checking subdomain availability:', error);
      setAvailabilityCheck({ subdomain: false, checking: false });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Auto-update subdomain based on company name if user hasn't manually changed it
    if (name === 'name' && !formData.subdomain) {
      const autoSubdomain = value.toLowerCase().replace(/[^a-z0-9]/g, '');
      setFormData(prev => ({
        ...prev,
        subdomain: autoSubdomain
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.subdomain.trim()) newErrors.subdomain = 'Subdomain is required';
    if (!formData.billingEmail.trim()) newErrors.billingEmail = 'Billing email is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.billingEmail && !emailRegex.test(formData.billingEmail)) {
      newErrors.billingEmail = 'Please enter a valid billing email';
    }
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid contact email';
    }

    // Subdomain validation
    if (formData.subdomain) {
      const subdomainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
      if (!subdomainRegex.test(formData.subdomain) || formData.subdomain.length < 3) {
        newErrors.subdomain = 'Subdomain must be 3+ characters and contain only lowercase letters, numbers, and hyphens';
      } else if (!availabilityCheck.subdomain) {
        newErrors.subdomain = 'Subdomain is not available';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/companies', {
        ...formData,
        plan: 'free',  // Default to free plan - users can upgrade later in settings
        ownerName: user?.name || '',
        ownerEmail: user?.email || '',
        ownerPassword: '' // Will not be needed since user already exists
      });

      // Set success and redirect after delay
      setSuccess(true);
      
      // Redirect to company dashboard after showing success message
      setTimeout(() => {
        // Since the user is already authenticated, we need to redirect to the external subdomain
        // For development, we'll show a message and provide a link to visit the new company
        if (window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')) {
          // In development, show a message since subdomains might not work properly
          alert(`Company created successfully! Your subdomain is: ${response.data.company.subdomain}.${window.location.hostname}\n\nIn a production environment, you would be redirected to your company's dedicated subdomain.`);
        } else {
          // In production, redirect to the subdomain
          window.location.href = `https://${response.data.company.subdomain}.${window.location.hostname}`;
        }
      }, 2000);
    } catch (error) {
      console.error('Company creation error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during company creation';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-left">
            <div className="login-brand">
              <div className="login-logo">
                <svg xmlns="http://www.w3.org/2000/svg" className="login-logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h1 className="login-brand-title">Support Panel</h1>
              <p className="login-brand-subtitle">Professional ticket management solution</p>
            </div>
            
            <div className="login-features">
              <div className="login-feature">
                <div className="login-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Company Created Successfully</h3>
                  <p className="login-feature-description">Your dedicated support environment is being set up</p>
                </div>
              </div>
              
              <div className="login-feature">
                <div className="login-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Secure Access</h3>
                  <p className="login-feature-description">Enterprise-grade security for your support data</p>
                </div>
              </div>
              
              <div className="login-feature">
                <div className="login-feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Ticket Management</h3>
                  <p className="login-feature-description">Track and resolve customer issues effectively</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="login-right">
            <div className="login-card">
              <div className="login-header">
                <h2 className="login-title">Company Created Successfully!</h2>
                <p className="login-subtitle">You will be redirected to your company dashboard shortly...</p>
              </div>
              
              <div className="alert alert--success login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Your company has been created successfully! Redirecting to your dedicated subdomain: <strong>{formData.subdomain}.{window.location.hostname.replace('www.', '')}</strong>
              </div>
              
              <div className="form-group">
                <div className="spinner-centered">
                  <div className="spinner"></div>
                </div>
              </div>
              
              <div className="login-footer">
                <p>Already have an account? <a href="/login" className="login-link">Sign in</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <div className="login-logo">
              <svg xmlns="http://www.w3.org/2000/svg" className="login-logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="login-brand-title">Support Panel</h1>
            <p className="login-brand-subtitle">Professional ticket management solution</p>
          </div>
          
          <div className="login-features">
            <div className="login-feature">
              <div className="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="login-feature-content">
                <h3 className="login-feature-title">Dedicated Environment</h3>
                <p className="login-feature-description">Your data and customers are isolated in your own secure environment</p>
              </div>
            </div>
            
            <div className="login-feature">
              <div className="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="login-feature-content">
                <h3 className="login-feature-title">Team Collaboration</h3>
                <p className="login-feature-description">Work together with your support team efficiently</p>
              </div>
            </div>
            
            <div className="login-feature">
              <div className="login-feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" className="feature-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="login-feature-content">
                <h3 className="login-feature-title">Ticket Management</h3>
                <p className="login-feature-description">Handle customer tickets efficiently with our tools</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Create Your Company</h2>
              <p className="login-subtitle">Set up your company's support environment</p>
            </div>
            
            {errors.general && (
              <div className="alert alert--danger login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.general}
              </div>
            )}
            
            <form className="login-form" onSubmit={handleSubmit}>
              {/* Default to free plan - plan selection moved to settings */}

              {/* Company Details */}
              <div className="form-section mb-4">
                <h3 className="form-section-title mb-3">Company Details</h3>
                
                <div className="form-group mb-3">
                  <label htmlFor="company-name" className="form-label">Company Name *</label>
                  <input
                    id="company-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter your company name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="company-subdomain" className="form-label">Subdomain *</label>
                  <div className="relative">
                    <input
                      id="company-subdomain"
                      name="subdomain"
                      type="text"
                      value={formData.subdomain}
                      onChange={handleChange}
                      className={`form-control ${errors.subdomain ? 'is-invalid' : ''}`}
                      placeholder="your-company"
                    />
                    <div className="subdomain-suffix">
                      .{window.location.hostname.replace('www.', '')}
                    </div>
                    {availabilityCheck.checking && (
                      <div className="subdomain-checking">
                        <div className="spinner"></div>
                      </div>
                    )}
                  </div>
                  <p className="help-text">This will be your unique support portal URL</p>
                  {errors.subdomain && <div className="invalid-feedback">{errors.subdomain}</div>}
                  {availabilityCheck.subdomain === true && (
                    <p className="availability-message available">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      This subdomain is available
                    </p>
                  )}
                  {availabilityCheck.subdomain === false && formData.subdomain && availabilityCheck.subdomain !== null && !errors.subdomain && (
                    <p className="availability-message not-available">
                      <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      This subdomain is not available
                    </p>
                  )}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="company-billing-email" className="form-label">Billing Email *</label>
                  <input
                    id="company-billing-email"
                    name="billingEmail"
                    type="email"
                    value={formData.billingEmail}
                    onChange={handleChange}
                    className={`form-control ${errors.billingEmail ? 'is-invalid' : ''}`}
                    placeholder="billing@company.com"
                  />
                  {errors.billingEmail && <div className="invalid-feedback">{errors.billingEmail}</div>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="company-contact-email" className="form-label">Contact Email *</label>
                  <input
                    id="company-contact-email"
                    name="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className={`form-control ${errors.contactEmail ? 'is-invalid' : ''}`}
                    placeholder="contact@company.com"
                  />
                  {errors.contactEmail && <div className="invalid-feedback">{errors.contactEmail}</div>}
                </div>
              </div>

              <div className="form-group mb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn--primary btn--block"
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Creating Company...
                    </>
                  ) : (
                    'Create Company - Free Plan'
                  )}
                </button>
              </div>
            </form>
            
            <div className="login-footer">
              <p>Already have an account? <a href="/login" className="login-link">Sign in</a></p>
              <p>Are you an agent? <a href="/agent-login" className="login-link">Sign in as agent</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreation;