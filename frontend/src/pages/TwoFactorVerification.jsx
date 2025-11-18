import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const TwoFactorVerification = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [resending, setResending] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login } = useAuth();

  // Extract email from location state or query params
  useState(() => {
    const query = new URLSearchParams(location.search);
    const emailParam = query.get('email') || location.state?.email;
    const rememberMeParam = query.get('rememberMe') === 'true';
    
    if (emailParam) {
      setEmail(emailParam);
    }
    if (rememberMeParam) {
      setRememberMe(true);
    }
  });

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // First verify the 2FA token
      const verifyResponse = await api.post('/2fa/verify-token', {
        email,
        token
      });
      
      if (verifyResponse.data.success) {
        // Now perform the actual login
        const loginResponse = await login(email, null, rememberMe, token); // Pass 2FA token if needed
        if (loginResponse.success) {
          navigate('/dashboard');
        } else {
          setError(loginResponse.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify 2FA token');
    } finally {
      setLoading(false);
    }
  };

  // Update AuthContext to handle 2FA during login
  const handleResendCode = async () => {
    setResending(true);
    setError('');
    
    try {
      // In a real implementation, you might have a way to resend 2FA codes
      // For now we'll just show a message
      setError('In a real implementation, this would resend a verification code');
    } catch (err) {
      setError('Failed to resend verification code');
      console.error('Resend 2FA error:', err);
    } finally {
      setResending(false);
    }
  };

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="login-feature-content">
                <h3 className="login-feature-title">2-Factor Authentication</h3>
                <p className="login-feature-description">Additional security layer for your account</p>
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
              <h2 className="login-title">Two-Factor Authentication</h2>
              <p className="login-subtitle">Enter the code from your authenticator app</p>
            </div>
            
            {error && (
              <div className="alert alert--danger login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            <form onSubmit={handleVerify} className="login-form">
              <div className="form-group">
                <label htmlFor="twofactor-token" className="form-label">Authentication Code</label>
                <input
                  id="twofactor-token"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="6"
                  required
                  value={token}
                  onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                  className="form-control"
                  placeholder="123456"
                />
                <div className="form-help-text">
                  Enter the 6-digit code from your authenticator app
                </div>
              </div>
              
              <div className="form-group">
                <button
                  type="submit"
                  disabled={loading || token.length !== 6}
                  className="btn btn--primary btn--block login-submit-btn"
                >
                  {loading ? (
                    'Verifying...'
                  ) : (
                    'Verify and Login'
                  )}
                </button>
              </div>
            </form>
            
            <div className="divider">
              <span className="divider-text">Having trouble?</span>
            </div>
            
            <div className="form-group">
              <button
                onClick={handleResendCode}
                disabled={resending}
                className="btn btn--outline btn--block"
              >
                {resending ? (
                  'Sending...'
                ) : (
                  'Resend Code'
                )}
              </button>
            </div>
            
            <div className="login-footer">
              <p>Remember your password? <Link to="/login" className="login-link">Return to login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorVerification;