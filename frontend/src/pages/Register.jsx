import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Password generation function
  const generatePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
    
    setFormData(prev => ({
      ...prev,
      password: generatedPassword,
      confirmPassword: generatedPassword
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      setSuccess(true);
      
      // Check if registration was successful and redirect to verification
      if (response.data.email) {
        setTimeout(() => {
          navigate(`/verify-email?email=${encodeURIComponent(response.data.email)}`);
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed');
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="login-feature-content">
                  <h3 className="login-feature-title">Email Verification</h3>
                  <p className="login-feature-description">We've sent a verification code to your email</p>
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
                <h2 className="login-title">Registration Successful</h2>
                <p className="login-subtitle">Please verify your email address</p>
              </div>
              
              <div className="alert alert--success login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Thanks for registering! We've sent a verification email to {email}. Please check your inbox to verify your account.
              </div>
              
              <div className="form-group">
                <button
                  onClick={() => navigate(`/verify-email?email=${encodeURIComponent(email)}`)}
                  className="btn btn--primary btn--block login-submit-btn"
                >
                  Continue to Verification
                </button>
              </div>
              
              <div className="login-footer">
                <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
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
                <p className="login-feature-description">Track and resolve customer issues effectively</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="login-right">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Create an account</h2>
              <p className="login-subtitle">Get started with the support panel today</p>
            </div>
            
            {error && (
              <div className="alert alert--danger login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={onSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={onChange}
                  className="form-control"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email-register" className="form-label">Email address</label>
                <input
                  id="email-register"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={onChange}
                  className="form-control"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password-register" className="form-label">Password</label>
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="password-input-wrapper">
                  <input
                    id="password-register"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={onChange}
                    className="form-control"
                    placeholder="••••••••"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="password-generator-btn-inside"
                    onClick={generatePassword}
                    title="Generate password"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="password-generator-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
                <div className="form-help-text">
                  Password must be at least 6 characters
                </div>
              </div>
              
              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="password-input-wrapper">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={onChange}
                    className="form-control"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="password-generator-btn-inside"
                    onClick={() => {
                      // Also generate for confirm password when generating for main password
                      setFormData(prev => ({
                        ...prev,
                        confirmPassword: password
                      }));
                    }}
                    title="Match password"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="password-generator-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn--primary login-submit-btn"
                >
                  {loading ? (
                    'Creating account...'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
            
            <div className="login-footer">
              <p>Want to create a company account? <Link to="/signup" className="login-link">Create company account</Link></p>
              <p className="mt-2">Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;