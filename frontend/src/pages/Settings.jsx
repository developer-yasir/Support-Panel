import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardSettings } from '../contexts/DashboardSettingsContext';
import { useTheme } from '../contexts/ThemeContext';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import './CompanySignup.css'; // Import plan card styles
import './Settings.css'; // Import specific settings styles

// Profile Settings Section Component
const ProfileSettingsSection = ({ profile, onInputChange, onSave, saving, loading }) => {
  if (loading) return <div className="loading">Loading profile settings...</div>;
  
  return (
    <div className="card settings__card">
      <div className="card__body">
        <div className="settings__section">
          <h3 className="settings__section-title">Profile Information</h3>
          <p className="settings__help-text">Update your personal information used across the platform</p>

          <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={profile.name}
                onChange={onInputChange}
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={onInputChange}
                className="form-control"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={onInputChange}
                className="form-control"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="settings__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Section Component
const NotificationSettingsSection = ({ settings, onInputChange, onSubmit, saving, loading }) => {
  if (loading) return <div className="loading">Loading notification settings...</div>;

  return (
    <div className="card settings__card">
      <div className="card__body">
        <div className="settings__section">
          <h3 className="settings__section-title">Notification Preferences</h3>
          <p className="settings__help-text">Customize how and when you receive notifications</p>

          <form onSubmit={onSubmit}>
            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="emailNotifications" className="form-label settings__label">
                  Email Notifications
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    name="emailNotifications"
                    checked={settings.emailNotifications}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="emailNotifications" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Receive important updates and alerts via email</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="inAppNotifications" className="form-label settings__label">
                  In-App Notifications
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="inAppNotifications"
                    name="inAppNotifications"
                    checked={settings.inAppNotifications}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="inAppNotifications" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Receive notifications directly in the application</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="pushNotifications" className="form-label settings__label">
                  Push Notifications
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="pushNotifications"
                    name="pushNotifications"
                    checked={settings.pushNotifications}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="pushNotifications" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Receive real-time notifications on your device</p>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <h4 className="settings__subsection-title">Ticket Notifications</h4>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="ticketAssignment" className="form-label settings__label">
                  Ticket Assignments
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="ticketAssignment"
                    name="ticketAssignment"
                    checked={settings.ticketAssignment}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="ticketAssignment" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Notify when tickets are assigned to you</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="ticketUpdates" className="form-label settings__label">
                  Ticket Updates
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="ticketUpdates"
                    name="ticketUpdates"
                    checked={settings.ticketUpdates}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="ticketUpdates" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Notify when tickets you're involved with are updated</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="mentions" className="form-label settings__label">
                  Mentions
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="mentions"
                    name="mentions"
                    checked={settings.mentions}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="mentions" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Notify when you're mentioned in tickets or comments</p>
            </div>

            <div className="settings__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Notification Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Security Settings Section Component
const SecuritySettingsSection = ({ settings, onInputChange, onSubmit, saving, loading }) => {
  if (loading) return <div className="loading">Loading security settings...</div>;

  return (
    <div className="card settings__card">
      <div className="card__body">
        <div className="settings__section">
          <h3 className="settings__section-title">Security Settings</h3>
          <p className="settings__help-text">Manage your account security preferences</p>

          <form onSubmit={onSubmit}>
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
                    checked={settings.twoFactorEnabled}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="twoFactorEnabled" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Add an extra layer of security to your account</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="passwordChangedRecently" className="form-label settings__label">
                  Require Password Change
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="passwordChangedRecently"
                    name="passwordChangedRecently"
                    checked={settings.passwordChangedRecently}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="passwordChangedRecently" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Prompt to change password after certain period</p>
            </div>

            <div className="settings__actions">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Security Settings'}
              </button>
              <button type="button" className="btn btn--secondary ml-2">Change Password</button>
              <button type="button" className="btn btn--outline ml-2">View Security Log</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Ticket Settings Section Component
const TicketSettingsSection = ({ settings, onSave, saving, loading }) => {
  if (loading) return <div className="loading">Loading ticket settings...</div>;

  return (
    <div className="card settings__card">
      <div className="card__body">
        <div className="settings__section">
          <h3 className="settings__section-title">Ticket Management</h3>
          <p className="settings__help-text">Configure ticket handling and workflow preferences</p>

          <form>
            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="autoAssign" className="form-label settings__label">
                  Auto-assign Tickets
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="autoAssign"
                    name="autoAssign"
                    checked={settings.autoAssign}
                    onChange={(e) => {}} // Will be updated with proper handler
                    className="settings__toggle-input"
                  />
                  <label htmlFor="autoAssign" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Automatically assign new tickets based on availability</p>
            </div>

            <div className="form-group">
              <label htmlFor="defaultPriority" className="form-label settings__label">
                Default Ticket Priority
              </label>
              <select
                id="defaultPriority"
                name="defaultPriority"
                value={settings.defaultPriority}
                onChange={(e) => {}} // Will be updated with proper handler
                className="form-control form-control--select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <p className="settings__help-text">Default priority level for new tickets</p>
            </div>

            <div className="settings__actions">
              <button type="button" className="btn btn--primary" onClick={onSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Ticket Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// General Settings Section Component
const GeneralSettingsSection = ({ appSettings, onInputChange, onSave, saving, loading }) => {
  if (loading) return <div className="loading">Loading general settings...</div>;

  return (
    <div className="card settings__card">
      <div className="card__body">
        <div className="settings__section">
          <h3 className="settings__section-title">Preferences</h3>
          
          <div className="form-group">
            <div className="settings__toggle-group">
              <label htmlFor="notifications" className="form-label settings__label">
                Enable General Notifications
              </label>
              <div className="settings__toggle">
                <input
                  type="checkbox"
                  id="notifications"
                  name="notifications"
                  checked={appSettings.notifications}
                  onChange={onInputChange}
                  className="settings__toggle-input"
                />
                <label htmlFor="notifications" className="settings__toggle-label">
                  <span className="settings__toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="settings__help-text">Receive general notifications for important updates</p>
          </div>
          
          <div className="form-group">
            <div className="settings__toggle-group">
              <label htmlFor="emailAlerts" className="form-label settings__label">
                Email Alerts
              </label>
              <div className="settings__toggle">
                <input
                  type="checkbox"
                  id="emailAlerts"
                  name="emailAlerts"
                  checked={appSettings.emailAlerts}
                  onChange={onInputChange}
                  className="settings__toggle-input"
                />
                <label htmlFor="emailAlerts" className="settings__toggle-label">
                  <span className="settings__toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="settings__help-text">Receive email notifications for important events</p>
          </div>
          
          <div className="form-group">
            <div className="settings__toggle-group">
              <label htmlFor="darkMode" className="form-label settings__label">
                Dark Mode
              </label>
              <div className="settings__toggle">
                <input
                  type="checkbox"
                  id="darkMode"
                  name="darkMode"
                  checked={appSettings.darkMode}
                  onChange={onInputChange}
                  className="settings__toggle-input"
                />
                <label htmlFor="darkMode" className="settings__toggle-label">
                  <span className="settings__toggle-slider"></span>
                </label>
              </div>
            </div>
            <p className="settings__help-text">Enable dark theme for reduced eye strain</p>
          </div>
        </div>
        
        <div className="settings__section mt-4">
          <h3 className="settings__section-title">Language</h3>
          
          <div className="form-group">
            <label htmlFor="language" className="form-label settings__label">
              Application Language
            </label>
            <select
              id="language"
              name="language"
              value={appSettings.language}
              onChange={onInputChange}
              className="form-control form-control--select"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="it">Italian</option>
              <option value="ja">Japanese</option>
            </select>
            <p className="settings__help-text">Select your preferred language for the application</p>
          </div>
        </div>
        
        <div className="settings__actions">
          <button type="button" className="btn btn--primary settings__save-btn" onClick={onSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Application Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const { dashboardSettings, updateSetting } = useDashboardSettings();
  const { theme, toggleTheme, setThemeMode } = useTheme();
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    emailAlerts: true,
    language: 'en',
    darkMode: theme === 'dark'
  });
  const [profile, setProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [security, setSecurity] = useState({
    twoFactorEnabled: false,
    passwordChangedRecently: false
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    pushNotifications: false,
    ticketAssignment: true,
    ticketUpdates: true,
    mentions: true
  });
  const [ticketSettings, setTicketSettings] = useState({
    autoAssign: false,
    defaultPriority: 'medium',
    categories: [],
    customFields: []
  });
  const [companyInfo, setCompanyInfo] = useState(null);
  const [setupInfo, setSetupInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [planLoading, setPlanLoading] = useState(false);
  const [planChangeSuccess, setPlanChangeSuccess] = useState(false);

  const handleDashboardSettingsSubmit = (e) => {
    e.preventDefault();
    // Dashboard settings are automatically saved to localStorage
    alert('Dashboard settings saved successfully!');
  };

  // Fetch user profile and company info
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get company information
        const companyResponse = await api.get('/companies/current');
        setCompanyInfo(companyResponse.data);
        
        // Get available plans
        const setupResponse = await api.get('/companies/setup-info');
        setSetupInfo(setupResponse.data);
        
        // Get user security info (if available)
        const userResponse = await api.get('/auth/profile');
        setSecurity(prev => ({
          ...prev,
          twoFactorEnabled: userResponse.data.twoFactorEnabled || false
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      const response = await api.put('/auth/profile', profile);
      updateProfile(profile); // Update the context
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to update profile: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationSettingsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Save notification settings to backend
      await api.put('/users/notification-settings', notificationSettings);
      setSaveMessage('Notification settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save notification settings: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSecuritySettingsSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/users/security-settings', security);
      setSaveMessage('Security settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save security settings: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePlanChange = async (newPlan) => {
    if (!companyInfo) return;
    
    setPlanLoading(true);
    setPlanChangeSuccess(false);
    
    try {
      const response = await api.put(`/companies/admin/${companyInfo._id}/plan`, {
        plan: newPlan
      });
      
      // Update local state
      setCompanyInfo(prev => ({
        ...prev,
        plan: newPlan,
        features: response.data.company.features
      }));
      
      setPlanChangeSuccess(true);
      setTimeout(() => setPlanChangeSuccess(false), 3000);
    } catch (error) {
      console.error('Error changing plan:', error);
      alert('Failed to change plan: ' + (error.response?.data?.message || 'Unknown error'));
    } finally {
      setPlanLoading(false);
    }
  };

  const handleInputChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    switch(section) {
      case 'profile':
        setProfile(prev => ({ ...prev, [name]: newValue }));
        break;
      case 'notifications':
        setNotificationSettings(prev => ({ ...prev, [name]: newValue }));
        break;
      case 'security':
        setSecurity(prev => ({ ...prev, [name]: newValue }));
        break;
      case 'app':
        setAppSettings(prev => ({ ...prev, [name]: newValue }));
        break;
      default:
        break;
    }
  };

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return <ProfileSettingsSection 
          profile={profile} 
          onInputChange={(e) => handleInputChange(e, 'profile')}
          onSave={handleProfileUpdate}
          saving={saving}
          loading={loading}
        />;
      case 'notifications':
        return <NotificationSettingsSection 
          settings={notificationSettings}
          onInputChange={(e) => handleInputChange(e, 'notifications')}
          onSubmit={handleNotificationSettingsSubmit}
          saving={saving}
          loading={loading}
        />;
      case 'security':
        return <SecuritySettingsSection 
          settings={security}
          onInputChange={(e) => handleInputChange(e, 'security')}
          onSubmit={handleSecuritySettingsSubmit}
          saving={saving}
          loading={loading}
        />;
      case 'tickets':
        return <TicketSettingsSection 
          settings={ticketSettings}
          onInputChange={(e) => handleInputChange(e, 'tickets')}
          onSave={() => {}}
          saving={saving}
          loading={loading}
        />;
      default:
        return <GeneralSettingsSection 
          appSettings={appSettings}
          onInputChange={(e) => handleInputChange(e, 'app')}
          onSave={handleDashboardSettingsSubmit}
          saving={saving}
          loading={loading}
        />;
    }
  };

  return (
    <div className="settings">
      <Navbar />
      <div className="container settings__container">
        <div className="settings__header">
          <h1 className="settings__title">
            <svg xmlns="http://www.w3.org/2000/svg" className="icon settings__title-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </h1>
          <p className="settings__subtitle">Manage your account preferences and application settings</p>
        </div>

        {/* Tab Navigation */}
        <div className="settings-tabs">
          <div className="settings-tabs__list">
            <button 
              className={`settings-tab ${activeTab === 'profile' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-tab__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Profile
            </button>
            <button 
              className={`settings-tab ${activeTab === 'notifications' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('notifications')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-tab__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </button>
            <button 
              className={`settings-tab ${activeTab === 'security' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-tab__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </button>
            <button 
              className={`settings-tab ${activeTab === 'tickets' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-tab__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Tickets
            </button>
            <button 
              className={`settings-tab ${activeTab === 'general' ? 'settings-tab--active' : ''}`}
              onClick={() => setActiveTab('general')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-tab__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              General
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className={`alert ${saveMessage.includes('successfully') ? 'alert--success' : 'alert--danger'} settings__save-message`}>
            <span>{saveMessage}</span>
          </div>
        )}

        {renderTabContent()}

        {/* Dashboard Features Settings - existing section */}
        <div className="card settings__card mt-4">
          <div className="card__body">
            <form onSubmit={handleDashboardSettingsSubmit} className="settings__form">
              <div className="settings__section">
                <h3 className="settings__section-title">Dashboard Features</h3>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showCompanyTickets" className="form-label settings__label">
                      Company Tickets
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showCompanyTickets"
                        name="showCompanyTickets"
                        checked={dashboardSettings.showCompanyTickets}
                        onChange={(e) => updateSetting('showCompanyTickets', e.target.checked)}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showCompanyTickets" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show company-specific ticket breakdown</p>
                </div>
              </div>
              
              <div className="settings__actions">
                <button type="submit" className="btn btn--primary settings__save-btn">
                  Save Dashboard Settings
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Company Management Section - existing section */}
        <div className="card settings__card mt-4">
          <div className="card__body">
            <div className="settings__section">
              <h3 className="settings__section-title">Company Management</h3>
              <p className="settings__help-text">Manage your company account and settings</p>
              
              <div className="settings__actions">
                <Link to="/create-company" className="btn btn--primary settings__create-company-btn">
                  Create Company
                </Link>
              </div>
            </div>
          </div>
        </div>
        
        {/* Plan Management Section - existing section */}
        <div className="card settings__card mt-4">
          <div className="card__body">
            <div className="settings__section">
              <h3 className="settings__section-title">Plan Management</h3>
              <p className="settings__help-text">
                Current plan: <strong>{companyInfo?.plan?.charAt(0).toUpperCase() + companyInfo?.plan?.slice(1) || 'Loading...'}</strong>
              </p>
              
              {loading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading plan information...</p>
                </div>
              ) : (
                <div className="plan-management-section">
                  {planChangeSuccess && (
                    <div className="alert alert--success">
                      <svg xmlns="http://www.w3.org/2000/svg" className="alert-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="alert-message">Plan updated successfully!</span>
                    </div>
                  )}
                  
                  <div className="plan-cards-grid">
                    {setupInfo?.plans && Object.entries(setupInfo.plans).map(([key, plan]) => (
                      <div 
                        key={key}
                        className={`plan-card ${companyInfo?.plan === key ? 'plan-card--selected' : ''}`}
                        onClick={() => {
                          if (companyInfo?.plan !== key && !planLoading) {
                            handlePlanChange(key);
                          }
                        }}
                      >
                        <div className="plan-header">
                          <div>
                            <h4 className="plan-name">{plan.name}</h4>
                            {plan.price > 0 ? (
                              <div className="plan-price">
                                <span className="plan-amount">${plan.price}</span>
                                <span className="plan-period">/month</span>
                              </div>
                            ) : (
                              <div className="plan-price">
                                <span className="plan-amount">Free</span>
                              </div>
                            )}
                          </div>
                          {companyInfo?.plan === key && (
                            <div className="plan-checkmark">
                              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                        
                        <ul className="plan-features">
                          <li className="plan-feature">
                            <svg className="feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {plan.features.agentSeats} agent{plan.features.agentSeats !== 1 ? 's' : ''} included
                          </li>
                          <li className="plan-feature">
                            <svg className="feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {plan.features.ticketVolume.toLocaleString()} tickets/month
                          </li>
                          {plan.features.customFields && (
                            <li className="plan-feature">
                              <svg className="feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Custom Fields
                            </li>
                          )}
                          {plan.features.reporting && (
                            <li className="plan-feature">
                              <svg className="feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Advanced Reporting
                            </li>
                          )}
                          {plan.features.apiAccess && (
                            <li className="plan-feature">
                              <svg className="feature-icon text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              API Access
                            </li>
                          )}
                        </ul>
                        
                        <button 
                          className={`btn btn--${companyInfo?.plan === key ? 'secondary' : 'primary'} btn--block mt-3`}
                          disabled={companyInfo?.plan === key || planLoading}
                        >
                          {planLoading ? 'Processing...' : 
                           companyInfo?.plan === key ? 'Current Plan' : 
                           plan.price > 0 ? `Select ${plan.name}` : 'Select Free Plan'}
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="settings__help-text mt-3">
                    <p><strong>Billing Information:</strong></p>
                    <p>Current billing email: {companyInfo?.billingEmail || 'Loading...'}</p>
                    <p>Next billing date: {companyInfo?.nextBillingDate || 'N/A for free plan'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;