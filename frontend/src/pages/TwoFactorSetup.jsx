import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';

const TwoFactorSetup = () => {
  const [step, setStep] = useState(1); // 1: Setup, 2: Verify
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from auth context to get email
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // Get 2FA setup information
    const setupTwoFactor = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.post('/2fa/setup');
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
        setManualCode(response.data.secret); // Also provide manual entry option
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to setup 2FA');
        console.error('Setup 2FA error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      setupTwoFactor();
    }
  }, [currentUser, navigate]);

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/2fa/verify-setup', {
        token
      });
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify token');
      console.error('Verify 2FA error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">2FA Setup Complete!</h2>
              <p className="login-subtitle">Two-factor authentication is now enabled</p>
            </div>
            
            <div className="alert alert--success login-alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Two-factor authentication has been successfully enabled for your account.
            </div>
            
            <div className="form-group">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn btn--primary btn--block login-submit-btn"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading && !qrCode) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h2 className="login-title">Setting up 2FA</h2>
              <p className="login-subtitle">Please wait while we prepare your 2FA setup</p>
            </div>
            <div className="loading-spinner">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2 className="login-title">Set up Two-Factor Authentication</h2>
            <p className="login-subtitle">Enhance your account security</p>
          </div>
          
          {error && (
            <div className="alert alert--danger login-alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <div className="twofactor-setup-container">
            <div className="twofactor-setup-steps">
              <div className={`twofactor-step ${step >= 1 ? 'active' : ''}`}>
                <div className="twofactor-step-number">1</div>
                <div className="twofactor-step-text">Scan QR Code</div>
              </div>
              <div className={`twofactor-step ${step >= 2 ? 'active' : ''}`}>
                <div className="twofactor-step-number">2</div>
                <div className="twofactor-step-text">Enter Code</div>
              </div>
            </div>
            
            {step === 1 && (
              <div className="twofactor-setup-step1">
                <h3 className="twofactor-step-title">Scan with Google Authenticator</h3>
                <p className="twofactor-step-subtitle">Open Google Authenticator app and scan the QR code below</p>
                
                <div className="qr-code-container">
                  {qrCode ? (
                    <img src={qrCode} alt="2FA QR Code" className="qr-code" />
                  ) : (
                    <div className="qr-code-placeholder">Loading QR code...</div>
                  )}
                </div>
                
                <div className="divider">
                  <span className="divider-text">Or enter this code manually</span>
                </div>
                
                <div className="manual-code-container">
                  <div className="manual-code-display">
                    <span className="manual-code-label">Secret Key:</span>
                    <code className="manual-code-value">{manualCode}</code>
                  </div>
                  <button
                    className="btn btn--small btn--outline"
                    onClick={() => {
                      navigator.clipboard.writeText(manualCode);
                    }}
                  >
                    Copy
                  </button>
                </div>
                
                <div className="form-group">
                  <button
                    onClick={() => setStep(2)}
                    className="btn btn--primary btn--block login-submit-btn"
                  >
                    I've Scanned the Code
                  </button>
                </div>
              </div>
            )}
            
            {step === 2 && (
              <form onSubmit={handleVerifyToken} className="twofactor-setup-step2">
                <h3 className="twofactor-step-title">Verify Your Code</h3>
                <p className="twofactor-step-subtitle">Enter the 6-digit code from your authenticator app</p>
                
                <div className="form-group">
                  <label htmlFor="twofactor-token" className="form-label">Verification Code</label>
                  <input
                    id="twofactor-token"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="6"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                    className="form-control twofactor-token-input"
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
                      'Verify Code'
                    )}
                  </button>
                </div>
                
                <div className="form-group">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn btn--outline btn--block"
                  >
                    Back to QR Code
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorSetup;