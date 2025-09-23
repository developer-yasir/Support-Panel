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

    const response = await login(email, password);
    
    if (response.success) {
      navigate('/dashboard');
    } else {
      setError(response.message);
    }
    
    setLoading(false);
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

  return (
    <div className="login">
      <div className="card login__card">
        <div className="card__body">
          <div className="login__header">
            <div className="login__logo-wrapper">
              <div className="login__logo">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon login__logo-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="login__title">Support Panel</h1>
            <p className="login__subtitle">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="alert alert--danger login__error">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon alert__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={onSubmit} className="login__form">
            <div className="form-group login__form-group">
              <label htmlFor="email-address" className="form-label login__label">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="form-control login__input"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="form-group login__form-group">
              <div className="login__password-header">
                <label htmlFor="password" className="form-label login__label">Password</label>
                <a href="#" className="login__forgot-password">Forgot password?</a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={onChange}
                className="form-control login__input"
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group login__form-group">
              <button
                type="submit"
                disabled={loading}
                className="btn btn--primary btn--block login__submit-btn"
              >
                {loading ? (
                  <>
                    <div className="spinner spinner--small" style={{ width: '1rem', height: '1rem' }}></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon login__submit-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="form-group login__form-group">
            <button
              onClick={onGuestLogin}
              disabled={guestLoading}
              className="btn btn--outline btn--block login__guest-btn"
            >
              {guestLoading ? (
                <>
                  <div className="spinner spinner--small" style={{ width: '1rem', height: '1rem' }}></div>
                  Logging in as Guest...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon login__guest-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Continue as Guest
                </>
              )}
            </button>
          </div>
          
          <div className="login__footer">
            Don't have an account?{' '}
            <Link to="/register" className="login__register-link">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;