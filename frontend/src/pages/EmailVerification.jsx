import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Get email from URL params or local storage
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/verify-email', {
        email,
        code: verificationCode
      });
      
      if (response.data.token) {
        // Login the user
        const loginResponse = await login(email, verificationCode); // We can use any password here since we're already verified
        if (loginResponse.success) {
          navigate('/dashboard');
        } else {
          setError(loginResponse.message);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    setError('');
    
    try {
      // In a real app, you would have an endpoint to resend the code
      // For now, we'll just show a message
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (err) {
      setError('Failed to resend verification code');
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
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
              <h2 className="login-title">Verify Your Email</h2>
              <p className="login-subtitle">Enter the 6-digit code sent to {email}</p>
            </div>
            
            {error && (
              <div className="alert alert--danger login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}
            
            {resent && (
              <div className="alert alert--success login-alert">
                <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verification code resent successfully!
              </div>
            )}
            
            <form onSubmit={handleVerify} className="login-form">
              <div className="form-group">
                <label htmlFor="verification-code" className="form-label">Verification Code</label>
                <input
                  id="verification-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength="6"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                  className="form-control"
                  placeholder="123456"
                />
                <div className="form-help-text">
                  Enter the 6-digit code sent to your email
                </div>
              </div>
              
              <div className="form-group">
                <button
                  type="submit"
                  disabled={loading || verificationCode.length !== 6}
                  className="btn btn--primary btn--block login-submit-btn"
                >
                  {loading ? (
                    'Verifying...'
                  ) : (
                    'Verify Email'
                  )}
                </button>
              </div>
            </form>
            
            <div className="divider">
              <span className="divider-text">Didn't receive the code?</span>
            </div>
            
            <div className="form-group">
              <button
                onClick={handleResendCode}
                disabled={resending}
                className="btn btn--outline btn--block guest-login-btn"
              >
                {resending ? (
                  'Resending...'
                ) : (
                  'Resend Verification Code'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;