import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    timezone: 'UTC',
    notificationEmails: true,
    theme: 'light'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || '',
        phone: user.phone || '',
        timezone: user.timezone || 'UTC',
        notificationEmails: user.notificationEmails !== undefined ? user.notificationEmails : true,
        theme: user.theme || 'light'
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');
    
    try {
      const response = await api.put('/auth/profile', formData);
      updateProfile(response.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="container dashboard__container">
            <div className="loading-placeholder">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />
      <div className="dashboard__layout">
        <Sidebar />
        <div className="container dashboard__container">
          <div className="dashboard__header">
            <div className="dashboard-header__content">
              <div className="dashboard-header__title-wrapper">
                <h1 className="dashboard-header__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon dashboard-header__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" width="28" height="28">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </h1>
                <p className="dashboard-header__subtitle">Manage your account information</p>
              </div>
            </div>
          </div>

          {message && (
            <div className="alert alert--success">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="alert__content">
                <p className="alert__description">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert--danger">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="alert__content">
                <p className="alert__description">{error}</p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card__body">
              <div className="profile-header">
                <div className="profile-avatar-wrapper">
                  <div className="profile-avatar">
                    {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{formData.name}</h2>
                  <p className="profile-email">{formData.email}</p>
                  <p className="profile-role">{formData.role === 'admin' ? 'Administrator' : 'Support Agent'}</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row profile-info-grid">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="form-row profile-info-grid">
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">Role</label>
                    <input
                      type="text"
                      id="role"
                      name="role"
                      value={formData.role === 'admin' ? 'Administrator' : 'Support Agent'}
                      className="form-control"
                      disabled
                      readOnly
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="department" className="form-label">Department</label>
                    <input
                      type="text"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-row profile-info-grid">
                  <div className="form-group">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="form-control"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="timezone" className="form-label">Timezone</label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={formData.timezone}
                      onChange={handleChange}
                      className="form-control form-control--select"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">EST (Eastern Time)</option>
                      <option value="PST">PST (Pacific Time)</option>
                      <option value="CST">CST (Central Time)</option>
                      <option value="MST">MST (Mountain Time)</option>
                      <option value="GMT">GMT (Greenwich Mean Time)</option>
                      <option value="IST">IST (Indian Standard Time)</option>
                      <option value="CET">CET (Central European Time)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <div className="form-toggle-group">
                    <div className="form-toggle-item">
                      <div className="form-toggle-header">
                        <label className="form-label">Notification Emails</label>
                        <div className="settings__toggle">
                          <input
                            type="checkbox"
                            id="notificationEmails"
                            name="notificationEmails"
                            checked={formData.notificationEmails}
                            onChange={handleChange}
                            className="settings__toggle-input"
                          />
                          <label htmlFor="notificationEmails" className="settings__toggle-label">
                            <span className="settings__toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      <p className="form-toggle-description">Receive email notifications for important updates</p>
                    </div>
                    
                    <div className="form-toggle-item">
                      <div className="form-toggle-header">
                        <label className="form-label">Theme</label>
                        <div className="settings__toggle">
                          <input
                            type="checkbox"
                            id="theme"
                            name="theme"
                            checked={formData.theme === 'dark'}
                            onChange={(e) => setFormData(prev => ({
                              ...prev,
                              theme: e.target.checked ? 'dark' : 'light'
                            }))}
                            className="settings__toggle-input"
                          />
                          <label htmlFor="theme" className="settings__toggle-label">
                            <span className="settings__toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                      <p className="form-toggle-description">Switch between light and dark themes</p>
                    </div>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn btn--primary"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;