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
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-6">
          <div className="text-center mb-6">
            <div className="mb-4">
              <div className="mx-auto bg-blue-100 rounded-full p-3 d-inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Support Panel</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          {error && (
            <div className="alert alert-danger mb-4 d-flex align-items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={onSubmit}>
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
              <div className="d-flex justify-content-between">
                <label htmlFor="password" className="form-label">Password</label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800">Forgot password?</a>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={onChange}
                className="form-control"
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-block d-flex align-items-center justify-content-center"
              >
                {loading ? (
                  <>
                    <div className="spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign in
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="form-group">
            <button
              onClick={onGuestLogin}
              disabled={guestLoading}
              className="btn btn-outline btn-block d-flex align-items-center justify-content-center"
            >
              {guestLoading ? (
                <>
                  <div className="spinner me-2" style={{ width: '1rem', height: '1rem' }}></div>
                  Logging in as Guest...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Continue as Guest
                </>
              )}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;