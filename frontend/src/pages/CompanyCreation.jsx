import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

const CompanyCreation = () => {
  const [formData, setFormData] = useState({
    name: '',
    subdomain: '',
    billingEmail: '',
    contactEmail: '',
    plan: 'free'
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
        ownerName: '', // Will be populated from current user
        ownerEmail: '', // Will be populated from current user
        ownerPassword: '' // Will not be needed since user already exists
      });

      // Set success and redirect after delay
      setSuccess(true);
      
      // Redirect to company dashboard after showing success message
      setTimeout(() => {
        window.location.href = `https://${response.data.company.subdomain}.${window.location.hostname}`;
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
      <div className="company-creation-success-container">
        <div className="company-creation-success-card">
          <div className="company-creation-success-icon-container">
            <div className="company-creation-success-icon">
              <svg className="company-creation-success-check" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="company-creation-success-title">
            Company Created Successfully!
          </h2>
          <p className="company-creation-success-message">
            You will be redirected to your company dashboard shortly...
          </p>
          <p className="company-creation-success-submessage">
            Your dedicated subdomain: <strong>{formData.subdomain}.{window.location.hostname.replace('www.', '')}</strong>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="company-creation-container">
      <div className="company-creation-card">
        <div className="company-creation-header">
          <h1 className="company-creation-title">Create Your Company</h1>
          <p className="company-creation-subtitle">Set up your company's support environment</p>
        </div>

        {errors.general && (
          <div className="alert alert--error company-creation-alert">
            <svg className="alert-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="alert-message">{errors.general}</span>
          </div>
        )}

        {/* Plan Selection */}
        <div className="company-creation-plan-section">
          <h3 className="company-creation-plan-title">Choose Your Plan</h3>
          <p className="company-creation-plan-subtitle">All plans include your dedicated support environment</p>
          <div className="company-creation-plan-cards">
            {setupInfo && Object.entries(setupInfo.plans).map(([key, plan]) => (
              <div 
                key={key}
                className={`company-creation-plan-card ${formData.plan === key ? 'company-creation-plan-card--selected' : ''}`}
                onClick={() => setFormData({...formData, plan: key})}
              >
                <div className="company-creation-plan-header">
                  <div>
                    <h4 className="company-creation-plan-name">{plan.name}</h4>
                    {plan.price > 0 ? (
                      <div className="company-creation-plan-price">
                        <span className="company-creation-plan-amount">${plan.price}</span>
                        <span className="company-creation-plan-period">/month</span>
                      </div>
                    ) : (
                      <div className="company-creation-plan-price">
                        <span className="company-creation-plan-amount">Free</span>
                      </div>
                    )}
                  </div>
                  {formData.plan === key && (
                    <div className="company-creation-plan-checkmark">
                      <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <ul className="company-creation-plan-features">
                  <li className="company-creation-plan-feature">
                    <svg className="company-creation-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {plan.features.agentSeats} agent{plan.features.agentSeats !== 1 ? 's' : ''} included
                  </li>
                  <li className="company-creation-plan-feature">
                    <svg className="company-creation-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    {plan.features.ticketVolume.toLocaleString()} tickets/month
                  </li>
                  {plan.features.customFields && (
                    <li className="company-creation-plan-feature">
                      <svg className="company-creation-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Custom Fields
                    </li>
                  )}
                  {plan.features.reporting && (
                    <li className="company-creation-plan-feature">
                      <svg className="company-creation-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Advanced Reporting
                    </li>
                  )}
                  {plan.features.apiAccess && (
                    <li className="company-creation-plan-feature">
                      <svg className="company-creation-feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
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

        {/* Company Creation Form */}
        <form className="company-creation-form" onSubmit={handleSubmit}>
          <div className="company-creation-grid">
            <div className="form-section">
              <h3 className="form-section-title">Company Details</h3>
              
              <div className="form-group">
                <label htmlFor="company-name" className="form-label">
                  Company Name *
                </label>
                <input
                  id="company-name"
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
                <label htmlFor="company-subdomain" className="form-label">
                  Subdomain *
                </label>
                <div className="relative">
                  <input
                    id="company-subdomain"
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
                <label htmlFor="company-billing-email" className="form-label">
                  Billing Email *
                </label>
                <input
                  id="company-billing-email"
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
                <label htmlFor="company-contact-email" className="form-label">
                  Contact Email *
                </label>
                <input
                  id="company-contact-email"
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
                  Creating Company...
                </>
              ) : (
                `Create Company${formData.plan !== 'free' ? ` - $${setupInfo?.plans[formData.plan]?.price}/month` : ''}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyCreation;