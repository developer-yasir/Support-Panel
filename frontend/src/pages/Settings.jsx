import { useState } from 'react';
import Navbar from '../components/Navbar';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'en'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save these settings to a backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
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

        <div className="card settings__card">
          <div className="card__body">
            <form onSubmit={handleSubmit} className="settings__form">
              <div className="settings__section">
                <h3 className="settings__section-title">Preferences</h3>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="notifications" className="form-label settings__label">
                      Enable Notifications
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="notifications"
                        name="notifications"
                        checked={settings.notifications}
                        onChange={handleChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="notifications" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Receive notifications for important updates and alerts</p>
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
                        checked={settings.emailAlerts}
                        onChange={handleChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="emailAlerts" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Receive email notifications for ticket updates</p>
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
                        checked={settings.darkMode}
                        onChange={handleChange}
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
              
              <div className="settings__section">
                <h3 className="settings__section-title">Language</h3>
                
                <div className="form-group">
                  <label htmlFor="language" className="form-label settings__label">
                    Application Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className="form-control form-control--select"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                  <p className="settings__help-text">Select your preferred language for the application</p>
                </div>
              </div>
              
              <div className="settings__actions">
                <button type="submit" className="btn btn--primary settings__save-btn">
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;