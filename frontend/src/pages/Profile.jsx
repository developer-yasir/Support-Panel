import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    phone: '',
    avatar: '',
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    timezone: 'UTC',
    notificationEmails: true,
    theme: 'light'
  });

  const calculateProfileCompletion = () => {
    const requiredFields = [
      'name',
      'email',
      'avatar',
      'phone',
      'department'
    ];

    const completedFields = requiredFields.filter(field => {
      return profile[field] && profile[field].toString().trim() !== '';
    });

    const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
    return { completedFields: completedFields.length, totalFields: requiredFields.length, completionPercentage };
  };

  const { completionPercentage } = calculateProfileCompletion();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        department: user.department || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        profileVisibility: user.profileVisibility || 'public',
        showEmail: user.showEmail !== undefined ? user.showEmail : true,
        showPhone: user.showPhone !== undefined ? user.showPhone : false,
        timezone: user.timezone || 'UTC',
        notificationEmails: user.notificationEmails !== undefined ? user.notificationEmails : true,
        theme: user.theme || 'light'
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, GIF)');
        return;
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds 5MB limit');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          avatar: reader.result
        }));
        setError(''); // Clear any previous error
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setProfile(prev => ({
      ...prev,
      avatar: null
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      // Create a copy of profile to potentially modify
      const profileData = { ...profile };

      // Check if avatar is a new file (data URL) rather than existing avatar from server
      if (profile.avatar && typeof profile.avatar === 'string' && profile.avatar.startsWith('data:image')) {
        // If it's a data URL (newly selected file), we might need to handle differently
        // depending on how your backend handles file uploads
        // For now, assuming API can handle data URLs directly
      }

      const response = await api.put('/auth/profile', profileData);
      updateProfile(response.data);
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  // Password update functionality
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmNewPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }

    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      
      setPasswordSuccess('Password updated successfully!');
      setPasswordError('');
      
      // Clear the password fields
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      
      setTimeout(() => setPasswordSuccess(''), 3000);
    } catch (error) {
      setPasswordSuccess('');
      setPasswordError(error.response?.data?.message || 'Failed to update password');
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
          {/* Profile Header */}
          <div className="card profile-header-card mb-4">
            <div className="card__body">
              <div className="profile-header-content">
                <div className="profile-avatar-section">
                  <div className="profile-avatar-large">
                    {profile.avatar ? (
                      <img src={profile.avatar} alt="Profile" className="profile-img-preview" />
                    ) : (
                      <div className="profile-initial-placeholder">
                        {profile.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                    )}
                  </div>
                </div>

                <div className="profile-info-section">
                  <div className="profile-name-role">
                    <h1 className="profile-name-large">{profile.name}</h1>
                    <p className="profile-role-large">
                      {profile.role === 'admin' ? 'Administrator' :
                       profile.role === 'support_agent' ? 'Support Agent' :
                       profile.role === 'customer' ? 'Customer' : 'User'}
                    </p>
                    <p className="profile-email-large">{profile.email}</p>

                    {/* Profile Completion Indicator */}
                    <div className="profile-completion-section">
                      <div className="profile-completion-header">
                        <span className="profile-completion-text">Profile Completion</span>
                        <span className="profile-completion-percent">{completionPercentage}%</span>
                      </div>
                      <div className="profile-completion-bar">
                        <div
                          className="profile-completion-progress"
                          style={{ width: `${completionPercentage}%` }}
                        ></div>
                      </div>
                      <div className="profile-completion-details">
                        <span className="profile-completion-status">
                          {completionPercentage === 100 ? 'Complete!' :
                           completionPercentage >= 75 ? 'Almost there!' :
                           completionPercentage >= 50 ? 'Halfway there!' :
                           'Just getting started!'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="profile-actions">
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="btn btn--primary"
                    >
                      {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                    <button
                      onClick={handlePasswordUpdate}
                      className="btn btn--secondary ml-2"
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {message && (
            <div className="alert alert--success mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div className="alert__content">
                <p className="alert__description">{message}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert--danger mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="alert__content">
                <p className="alert__description">{error}</p>
              </div>
            </div>
          )}

          {/* Settings Cards Grid */}
          <div className="profile-settings-grid">
            {/* Security Card */}
            <div className="card profile-setting-card">
              <div className="card__header">
                <h3 className="card__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Security
                </h3>
              </div>
              <div className="card__body">
                <form onSubmit={handlePasswordUpdate}>
                  {passwordError && (
                    <div className="alert alert--danger mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="alert__content">
                        <p className="alert__description">{passwordError}</p>
                      </div>
                    </div>
                  )}

                  {passwordSuccess && (
                    <div className="alert alert--success mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <div className="alert__content">
                        <p className="alert__description">{passwordSuccess}</p>
                      </div>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="currentPassword" className="form-label">Current Password</label>
                    <input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <input
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      placeholder="Enter new password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmNewPassword" className="form-label">Confirm Password</label>
                    <input
                      id="confirmNewPassword"
                      name="confirmNewPassword"
                      type="password"
                      value={passwordForm.confirmNewPassword}
                      onChange={handlePasswordChange}
                      className="form-control"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <button type="submit" className="btn btn--primary btn--block">Update Password</button>
                </form>

                <div className="divider mt-4 mb-4"></div>

                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="twoFactorEnabled" className="form-label settings__label">
                      Two-Factor Authentication
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="twoFactorEnabled"
                        name="twoFactorEnabled"
                        checked={false}
                        onChange={() => {}}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="twoFactorEnabled" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Add an extra layer of security to your account</p>
                </div>
              </div>
            </div>


            {/* Privacy & Photo Card */}
            <div className="card profile-setting-card">
              <div className="card__header">
                <h3 className="card__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Privacy
                </h3>
              </div>
              <div className="card__body">
                <form onSubmit={handleSubmit}>
                  {/* Photo Section */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <h4 className="form-label mb-3">Profile Photo</h4>
                    <div className="text-center mb-3">
                      {profile.avatar ? (
                        <img src={profile.avatar} alt="Profile" className="profile-preview-image" />
                      ) : (
                        <div className="profile-preview-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" className="profile-preview-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Upload New Photo</label>
                      <input
                        id="newAvatar"
                        name="newAvatar"
                        type="file"
                        accept="image/*"
                        className="form-control file-input"
                        onChange={handleAvatarChange}
                      />
                      <label htmlFor="newAvatar" className="btn btn--outline btn--block">Choose File</label>
                    </div>

                    {profile.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        className="btn btn--danger btn--block mt-2"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>

                  {/* Privacy Settings */}
                  <div className="form-group">
                    <label htmlFor="profileVisibility" className="form-label">Profile Visibility</label>
                    <select
                      id="profileVisibility"
                      name="profileVisibility"
                      value={profile.profileVisibility}
                      onChange={handleChange}
                      className="form-control"
                    >
                      <option value="public">Public - Visible to everyone</option>
                      <option value="company">Company Only - Visible to colleagues</option>
                      <option value="private">Private - Only visible to me</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <div className="settings__toggle-group">
                      <label htmlFor="showEmail" className="form-label settings__label">
                        Show Email in Profile
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="showEmail"
                          name="showEmail"
                          checked={profile.showEmail}
                          onChange={handleChange}
                          className="settings__toggle-input"
                        />
                        <label htmlFor="showEmail" className="settings__toggle-label">
                          <span className="settings__toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="settings__toggle-group">
                      <label htmlFor="showPhone" className="form-label settings__label">
                        Show Phone Number
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="showPhone"
                          name="showPhone"
                          checked={profile.showPhone}
                          onChange={handleChange}
                          className="settings__toggle-input"
                        />
                        <label htmlFor="showPhone" className="settings__toggle-label">
                          <span className="settings__toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="settings__toggle-group">
                      <label htmlFor="notificationEmails" className="form-label settings__label">
                        Email Notifications
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="notificationEmails"
                          name="notificationEmails"
                          checked={profile.notificationEmails}
                          onChange={handleChange}
                          className="settings__toggle-input"
                        />
                        <label htmlFor="notificationEmails" className="settings__toggle-label">
                          <span className="settings__toggle-slider"></span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn--primary btn--block">Save Settings</button>
                </form>
              </div>
            </div>


            {/* Appearance Card */}
            <div className="card profile-setting-card">
              <div className="card__header">
                <h3 className="card__title">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                  Appearance
                </h3>
              </div>
              <div className="card__body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="timezone" className="form-label">Timezone</label>
                    <select
                      id="timezone"
                      name="timezone"
                      value={profile.timezone}
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

                  <div className="form-group">
                    <div className="settings__toggle-group">
                      <label htmlFor="theme" className="form-label settings__label">
                        Dark Mode
                      </label>
                      <div className="settings__toggle">
                        <input
                          type="checkbox"
                          id="theme"
                          name="theme"
                          checked={profile.theme === 'dark'}
                          onChange={(e) => setProfile(prev => ({
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
                  </div>

                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <select className="form-control form-control--select">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>

                  <button type="submit" className="btn btn--primary btn--block">Save Appearance Settings</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;