import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import './CompanySignup.css';

const CompanySignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    billingEmail: '',
    contactEmail: '',
    ownerName: '',
    ownerEmail: '',
    ownerPassword: '',
    ownerPasswordConfirm: ''
  });
  
  const [availabilityCheck, setAvailabilityCheck] = useState({
    subdomain: null,
    checking: false
  });
  
  const [setupInfo, setSetupInfo] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState('free');
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
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Owner email is required';
    if (!formData.ownerPassword) newErrors.ownerPassword = 'Password is required';
    if (!formData.ownerPasswordConfirm) newErrors.ownerPasswordConfirm = 'Please confirm password';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.billingEmail && !emailRegex.test(formData.billingEmail)) {
      newErrors.billingEmail = 'Please enter a valid billing email';
    }
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid contact email';
    }
    if (formData.ownerEmail && !emailRegex.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid owner email';
    }

    // Password confirmation
    if (formData.ownerPassword !== formData.ownerPasswordConfirm) {
      newErrors.ownerPasswordConfirm = 'Passwords do not match';
    }

    // Password strength
    if (formData.ownerPassword && formData.ownerPassword.length < 6) {
      newErrors.ownerPassword = 'Password must be at least 6 characters';
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
        plan: selectedPlan
      });

      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      
      // Set success and redirect after delay
      setSuccess(true);
      
      // Redirect to company dashboard after showing success message
      setTimeout(() => {
        // Redirect to company dashboard or main app
        window.location.href = `https://${response.data.company.subdomain}.${window.location.hostname}`;
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during signup';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getPlanFeatures = (planKey) => {
    if (!setupInfo || !setupInfo.plans[planKey]) return null;
    return setupInfo.plans[planKey];
  };

  if (success) {
    return (
      <div className="company-signup-success-container">
        <div className="company-signup-success-card">
          <div className="company-signup-success-icon-container">
            <div className="company-signup-success-icon">
              <svg className="company-signup-success-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="company-signup-success-title">
            Company Created Successfully!
          </h2>
          <p className="company-signup-success-message">
            You will be redirected to your company dashboard shortly...
          </p>
          <p className="company-signup-success-submessage">
            Your dedicated subdomain: <strong>{formData.subdomain}.{window.location.hostname.replace('www.', '')}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-signup-container">
      {/* Header */}
      <div className="company-signup-header">
        <div className="company-signup-header-content">
          <a href="/" className="company-signup-brand">
            <svg className="company-signup-brand-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Support Panel
          </a>
          <div className="company-signup-signin-links">
            <a href="/agent-login" className="company-signup-signin-link">
              Agent Sign In
            </a>
            <a href="/login" className="company-signup-signin-link ml-4">
              Customer Sign In
            </a>
          </div>
        </div>
      </div>

      <div className="company-signup-content">
        <div className="company-signup-card">
          <div className="company-signup-grid">
            {/* Multi-tenant Hero Section */}
            <div className="company-signup-hero">
              <div className="hero-content">
                <h1 className="company-signup-hero-title">
                  Create Your Dedicated Support Platform
                </h1>
                <p className="company-signup-hero-subtitle">
                  Get your own white-label customer support solution with a unique subdomain
                </p>
                
                {/* Multi-tenant Benefits */}
                <div className="company-signup-features-grid">
                  <div className="company-signup-feature-card">
                    <div className="company-signup-feature-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <h3 className="company-signup-feature-title">Dedicated Environment</h3>
                    <p className="company-signup-feature-description">Your data and customers are isolated in your own secure environment</p>
                  </div>
                  
                  <div className="company-signup-feature-card">
                    <div className="company-signup-feature-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <h3 className="company-signup-feature-title">Performance Optimized</h3>
                    <p className="company-signup-feature-description">Dedicated resources ensure fast response times for your support team</p>
                  </div>
                  
                  <div className="company-signup-feature-card">
                    <div className="company-signup-feature-icon">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="company-signup-feature-title">Secure & Compliant</h3>
                    <p className="company-signup-feature-description">Enterprise-grade security with data protection and compliance features</p>
                  </div>
                </div>
              </div>
              
              {/* Multi-tenant Architecture Info */}
              <div className="architecture-card">
                <h3 className="architecture-title">How Our Multi-Tenant Architecture Works</h3>
                <div className="architecture-grid">
                  <div className="architecture-item">
                    <div className="architecture-number">1</div>
                    <h4>Unique Subdomain</h4>
                    <p>Get your own subdomain like {formData.subdomain || 'mycompany'}.yourapp.com</p>
                  </div>
                  <div className="architecture-item">
                    <div className="architecture-number">2</div>
                    <h4>Data Isolation</h4>
                    <p>Your data is completely separated from other tenants</p>
                  </div>
                  <div className="architecture-item">
                    <div className="architecture-number">3</div>
                    <h4>Dedicated Resources</h4>
                    <p>Guaranteed performance for your support operations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Form Section */}
            <div className="company-signup-form-container">
              {errors.general && (
                <div className="alert alert--error">
                  <div className="alert-content">
                    <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="alert-message">{errors.general}</span>
                  </div>
                </div>
              )}

              {/* Plan Selection */}
              <div className="company-signup-plan-section">
                <h3 className="company-signup-plan-title">Choose Your Plan</h3>
                <p className="company-signup-plan-subtitle">All plans include your dedicated support environment</p>
                <div className="company-signup-plan-cards">
                  {setupInfo && Object.entries(setupInfo.plans).map(([key, plan]) => (
                    <div 
                      key={key}
                      className={`company-signup-plan-card ${selectedPlan === key ? 'company-signup-plan-card--selected' : ''}`}
                      onClick={() => setSelectedPlan(key)}
                    >
                      <div className="company-signup-plan-header">
                        <div>
                          <h4 className="company-signup-plan-name">{plan.name}</h4>
                          {plan.price > 0 ? (
                            <div className="company-signup-plan-price">
                              <span className="company-signup-plan-amount">${plan.price}</span>
                              <span className="company-signup-plan-period">/month</span>
                            </div>
                          ) : (
                            <div className="company-signup-plan-price">
                              <span className="company-signup-plan-amount">Free</span>
                            </div>
                          )}
                        </div>
                        {selectedPlan === key && (
                          <div className="company-signup-plan-checkmark">
                            <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                      </div>
                      
                      <ul className="company-signup-plan-features">
                        <li className="company-signup-plan-feature">
                          <svg className="company-signup-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {plan.features.agentSeats} agent{plan.features.agentSeats !== 1 ? 's' : ''} included
                        </li>
                        <li className="company-signup-plan-feature">
                          <svg className="company-signup-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {plan.features.ticketVolume.toLocaleString()} tickets/month
                        </li>
                        {plan.features.customFields && (
                          <li className="company-signup-plan-feature">
                            <svg className="company-signup-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Custom Fields
                          </li>
                        )}
                        {plan.features.reporting && (
                          <li className="company-signup-plan-feature">
                            <svg className="company-signup-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Advanced Reporting
                          </li>
                        )}
                        {plan.features.apiAccess && (
                          <li className="company-signup-plan-feature">
                            <svg className="company-signup-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            API Access
                          </li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signup Form */}
              <form className="company-signup-form" onSubmit={handleSubmit}>
                <div className="signup-form-grid">
                  <div className="form-section">
                    <h3 className="form-section-title">Company Details</h3>
                    
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">
                        Company Name *
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`form-input ${errors.name ? 'form-input--error' : ''}`}
                        placeholder="Enter your company name"
                      />
                      {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="subdomain" className="form-label">
                        Subdomain *
                      </label>
                      <div className="relative">
                        <input
                          id="subdomain"
                          name="subdomain"
                          type="text"
                          value={formData.subdomain}
                          onChange={handleChange}
                          className={`form-input ${errors.subdomain ? 'form-input--error' : ''}`}
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
                      <p className="subdomain-help">This will be your unique support portal URL</p>
                      {errors.subdomain && <p className="form-error">{errors.subdomain}</p>}
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

                    <div className="form-group">
                      <label htmlFor="billingEmail" className="form-label">
                        Billing Email *
                      </label>
                      <input
                        id="billingEmail"
                        name="billingEmail"
                        type="email"
                        value={formData.billingEmail}
                        onChange={handleChange}
                        className={`form-input ${errors.billingEmail ? 'form-input--error' : ''}`}
                        placeholder="billing@company.com"
                      />
                      {errors.billingEmail && <p className="form-error">{errors.billingEmail}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contactEmail" className="form-label">
                        Contact Email *
                      </label>
                      <input
                        id="contactEmail"
                        name="contactEmail"
                        type="email"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        className={`form-input ${errors.contactEmail ? 'form-input--error' : ''}`}
                        placeholder="contact@company.com"
                      />
                      {errors.contactEmail && <p className="form-error">{errors.contactEmail}</p>}
                    </div>
                  </div>

                  <div className="form-section">
                    <h3 className="form-section-title">Owner Account</h3>
                    
                    <div className="form-group">
                      <label htmlFor="ownerName" className="form-label">
                        Owner/Manager Name *
                      </label>
                      <input
                        id="ownerName"
                        name="ownerName"
                        type="text"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className={`form-input ${errors.ownerName ? 'form-input--error' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.ownerName && <p className="form-error">{errors.ownerName}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="ownerEmail" className="form-label">
                        Owner Email *
                      </label>
                      <input
                        id="ownerEmail"
                        name="ownerEmail"
                        type="email"
                        value={formData.ownerEmail}
                        onChange={handleChange}
                        className={`form-input ${errors.ownerEmail ? 'form-input--error' : ''}`}
                        placeholder="john@company.com"
                      />
                      {errors.ownerEmail && <p className="form-error">{errors.ownerEmail}</p>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="ownerPassword" className="form-label">
                        Password *
                      </label>
                      <input
                        id="ownerPassword"
                        name="ownerPassword"
                        type="password"
                        value={formData.ownerPassword}
                        onChange={handleChange}
                        className={`form-input ${errors.ownerPassword ? 'form-input--error' : ''}`}
                        placeholder="••••••••"
                      />
                      {errors.ownerPassword && <p className="form-error">{errors.ownerPassword}</p>}
                      <p className="password-hint">Use at least 6 characters with a mix of letters and numbers</p>
                    </div>

                    <div className="form-group">
                      <label htmlFor="ownerPasswordConfirm" className="form-label">
                        Confirm Password *
                      </label>
                      <input
                        id="ownerPasswordConfirm"
                        name="ownerPasswordConfirm"
                        type="password"
                        value={formData.ownerPasswordConfirm}
                        onChange={handleChange}
                        className={`form-input ${errors.ownerPasswordConfirm ? 'form-input--error' : ''}`}
                        placeholder="••••••••"
                      />
                      {errors.ownerPasswordConfirm && <p className="form-error">{errors.ownerPasswordConfirm}</p>}
                    </div>
                  </div>
                </div>

                <div className="terms-section">
                  <div className="checkbox-group">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="checkbox-input"
                    />
                    <label htmlFor="terms" className="checkbox-label">
                      I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <input
                      id="dataConsent"
                      name="dataConsent"
                      type="checkbox"
                      required
                      className="checkbox-input"
                    />
                    <label htmlFor="dataConsent" className="checkbox-label">
                      I understand that my data will be securely stored in a dedicated environment and isolated from other tenants
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={loading}
                    className="submit-btn"
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span>
                        Setting Up Your Environment...
                      </>
                    ) : (
                      `Create Company${selectedPlan !== 'free' ? ` - $${getPlanFeatures(selectedPlan)?.price}/month` : ' - Free Forever'}` 
                    )}
                  </button>
                </div>
              </form>

              <div className="signin-link">
                <p className="text-sm text-gray-600">
                  Are you an agent?{' '}
                  <a href="/agent-login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in as agent
                  </a>
                </p>
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with trust indicators */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center space-x-8 mb-6">
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              SSL Secured
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              99.9% Uptime
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              24/7 Support
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Join thousands of companies using our platform to provide exceptional customer support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;