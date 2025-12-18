import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  // Automatically redirect to company signup
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/signup');
    }, 2000); // Redirect after 2 seconds to show message

    return () => clearTimeout(timer);
  }, [navigate]);

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
              <h2 className="login-title">Welcome to Support Panel</h2>
              <p className="login-subtitle">All accounts are now company-based</p>
            </div>

            <div className="alert alert--info login-alert">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              We've updated our registration process. All accounts are now company-based. You will be redirected to company registration.
            </div>

            <div className="form-group">
              <p className="text-center">Redirecting to company registration...</p>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="btn btn--primary btn--block"
              >
                Go to Company Registration Now
              </button>
            </div>

            <div className="login-footer">
              <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
              <p className="mt-2">Want to create a company account? <Link to="/signup" className="login-link">Sign up for company</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;