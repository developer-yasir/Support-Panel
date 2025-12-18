import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const CompanySignup = () => {
  const [formData, setFormData] = useState({
    name: '', // Company name
    ownerName: '', // The owner/manager name
    ownerEmail: '', // The owner/manager email
    ownerPassword: '',
    ownerPasswordConfirm: ''
  });

  const [setupInfo, setSetupInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const { login } = useAuth(); // Get the login function from auth context
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
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!formData.ownerEmail.trim()) newErrors.ownerEmail = 'Owner email is required';
    if (!formData.ownerPassword) newErrors.ownerPassword = 'Password is required';
    if (!formData.ownerPasswordConfirm) newErrors.ownerPasswordConfirm = 'Please confirm password';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Simplified payload - just the essential company and owner details
      const payload = {
        name: formData.name,
        // Use the owner details to create the company and the owner user in one step
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPassword: formData.ownerPassword,
        plan: 'free',  // Default to free plan
        // The owner becomes the manager of the company by default
        billingEmail: formData.ownerEmail, // Use owner email as billing email for simplicity
        contactEmail: formData.ownerEmail  // Use owner email as contact email for simplicity
      };

      const response = await api.post('/companies', payload);

      // Use the login function to store the token in auth context
      // This will also set up the authorization header
      await login(formData.ownerEmail, formData.ownerPassword);

      // Set success and redirect after delay
      setSuccess(true);

      // Redirect to company dashboard after showing success message
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.message || 'An error occurred during signup';
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
              <p className="login-subtitle">Get started with the support panel today</p>
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
              {/* Simplified form with essential fields only */}
              <div className="form-section mb-4">
                <h3 className="form-section-title mb-3">Company Information</h3>

                <div className="form-group mb-3">
                  <label htmlFor="name" className="form-label">Company Name *</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                    placeholder="Enter your company name"
                  />
                  {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title mb-3">Manager Account</h3>
                <p className="help-text mb-3">As the company owner, you'll be the main administrator</p>

                <div className="form-group mb-3">
                  <label htmlFor="ownerName" className="form-label">Full Name *</label>
                  <input
                    id="ownerName"
                    name="ownerName"
                    type="text"
                    value={formData.ownerName}
                    onChange={handleChange}
                    className={`form-control ${errors.ownerName ? 'is-invalid' : ''}`}
                    placeholder="Your full name"
                  />
                  {errors.ownerName && <div className="invalid-feedback">{errors.ownerName}</div>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="ownerEmail" className="form-label">Email Address *</label>
                  <input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={handleChange}
                    className={`form-control ${errors.ownerEmail ? 'is-invalid' : ''}`}
                    placeholder="your@email.com"
                  />
                  {errors.ownerEmail && <div className="invalid-feedback">{errors.ownerEmail}</div>}
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="ownerPassword" className="form-label">Password *</label>
                  <input
                    id="ownerPassword"
                    name="ownerPassword"
                    type="password"
                    value={formData.ownerPassword}
                    onChange={handleChange}
                    className={`form-control ${errors.ownerPassword ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.ownerPassword && <div className="invalid-feedback">{errors.ownerPassword}</div>}
                  <p className="help-text">Use at least 6 characters</p>
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="ownerPasswordConfirm" className="form-label">Confirm Password *</label>
                  <input
                    id="ownerPasswordConfirm"
                    name="ownerPasswordConfirm"
                    type="password"
                    value={formData.ownerPasswordConfirm}
                    onChange={handleChange}
                    className={`form-control ${errors.ownerPasswordConfirm ? 'is-invalid' : ''}`}
                    placeholder="••••••••"
                  />
                  {errors.ownerPasswordConfirm && <div className="invalid-feedback">{errors.ownerPasswordConfirm}</div>}
                </div>
              </div>

              <div className="terms-section mb-3">
                <div className="form-check">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="form-check-input"
                  />
                  <label htmlFor="terms" className="form-check-label">
                    I agree to the <a href="#" className="link">Terms of Service</a> and <a href="#" className="link">Privacy Policy</a>
                  </label>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanySignup;