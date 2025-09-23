import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailToVerify, setEmailToVerify] = useState('');

  const { login, guestLogin } = useAuth();
  const navigate = useNavigate();

  const { email, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(email, password);
      
      if (response.success) {
        navigate('/dashboard');
      } else {
        // Check if the error is related to email verification
        if (response.message.includes('verify your email')) {
          setEmailToVerify(email);
          // Redirect to verification page
          setTimeout(() => {
            navigate(`/verify-email?email=${encodeURIComponent(email)}`);
          }, 2000);
        } else {
          setError(response.message);
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onGuestLogin = async () => {
    setGuestLoading(true);
    setError('');

    const response = await guestLogin();
    
    if (response.success) {
      navigate('/dashboard');
    } else {
      setError(response.message);
    }
    
    setGuestLoading(false);
  };

  // If we need to redirect to email verification
  if (emailToVerify) {
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
                <h2 className="login-title">Email Verification Required</h2>
                <p className="login-subtitle">Please verify your email address</p>
              </div>
              
              <div className="alert alert--warning login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                You need to verify your email address before logging in. We've sent a verification code to {emailToVerify}.
              </div>
              
              <div className="form-group">
                <button
                  onClick={() => navigate(`/verify-email?email=${encodeURIComponent(emailToVerify)}`)}
                  className="btn btn--primary btn--block login-submit-btn"
                >
                  Continue to Verification
                </button>
              </div>
              
              <div className="login-footer">
                <p>Already verified? <Link to="/login" className="register-link" onClick={() => setEmailToVerify('')}>Try logging in again</Link></p>
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
              <h2 className="login-title">Welcome back</h2>
              <p className="login-subtitle">Sign in to your account to continue</p>
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
                <label htmlFor="email-address" className="form-label">Email address</label>
                <input
                  id="email-address"
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
                  <label htmlFor="password" className="form-label">Password</label>
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
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={onChange}
                    className="form-control"
                    placeholder="••••••••"
                  />
                </div>
                <a href="#" className="forgot-password">Forgot password?</a>
              </div>
              
              <div className="form-group">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn--primary btn--block login-submit-btn"
                >
                  {loading ? (
                    'Signing in...'
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>
            
            <div className="divider">
              <span className="divider-text">or continue with</span>
            </div>
            
            <div className="form-group">
              <button
                onClick={onGuestLogin}
                disabled={guestLoading}
                className="btn btn--outline btn--block guest-login-btn"
              >
                {guestLoading ? (
                  'Logging in as Guest...'
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="guest-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Continue as Guest
                  </>
                )}
              </button>
            </div>
            
            <div className="login-footer">
              <p>Don't have an account? <Link to="/register" className="register-link">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;