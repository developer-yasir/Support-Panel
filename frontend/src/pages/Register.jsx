import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'support_agent'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const { name, email, password, role } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const response = await register(name, email, password, role);
    
    if (response.success) {
      navigate('/dashboard');
    } else {
      setError(response.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-6">
          <div className="text-center mb-6">
            <div className="mb-4">
              <div className="mx-auto bg-blue-100 rounded-full p-3 d-inline-flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="icon text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Support Panel</h1>
            <p className="text-gray-600">Create a new account</p>
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
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={onChange}
                className="form-control"
                placeholder="John Doe"
              />
            </div>
            
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
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={onChange}
                className="form-control"
                placeholder="••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role" className="form-label">Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={onChange}
                className="form-control"
              >
                <option value="support_agent">Support Agent</option>
                <option value="admin">Admin</option>
              </select>
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
                    Creating account...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="icon me-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Create account
                  </>
                )}
              </button>
            </div>
          </form>
          
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;