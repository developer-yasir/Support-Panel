import { useState } from 'react';
import { useDashboardSettings } from '../contexts/DashboardSettingsContext';
import Navbar from '../components/Navbar';

const Settings = () => {
  const { dashboardSettings, updateSetting } = useDashboardSettings();
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    emailAlerts: true,
    darkMode: false,
    language: 'en'
  });

  const handleAppSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDashboardSettingChange = (e) => {
    const { name, checked } = e.target;
    updateSetting(name, checked);
  };

  const handleAppSettingsSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would save these settings to a backend
    console.log('Application settings saved:', appSettings);
    alert('Application settings saved successfully!');
  };
  
  const handleDashboardSettingsSubmit = (e) => {
    e.preventDefault();
    // Dashboard settings are automatically saved to localStorage
    alert('Dashboard settings saved successfully!');
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
            <form onSubmit={handleAppSettingsSubmit} className="settings__form">
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
                        checked={appSettings.notifications}
                        onChange={handleAppSettingChange}
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
                        checked={appSettings.emailAlerts}
                        onChange={handleAppSettingChange}
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
                        checked={appSettings.darkMode}
                        onChange={handleAppSettingChange}
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
                    value={appSettings.language}
                    onChange={handleAppSettingChange}
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
                  Save Application Settings
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="card settings__card">
          <div className="card__body">
            <form onSubmit={handleDashboardSettingsSubmit} className="settings__form">
              <div className="settings__section">
                <h3 className="settings__section-title">Dashboard Features</h3>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showRecentActivity" className="form-label settings__label">
                      Recent Activity
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showRecentActivity"
                        name="showRecentActivity"
                        checked={dashboardSettings.showRecentActivity}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showRecentActivity" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show the recent activity feed on the overview page</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showTicketCategories" className="form-label settings__label">
                      Ticket Categories
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showTicketCategories"
                        name="showTicketCategories"
                        checked={dashboardSettings.showTicketCategories}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showTicketCategories" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show the ticket categories breakdown</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showAgentPerformance" className="form-label settings__label">
                      Agent Performance
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showAgentPerformance"
                        name="showAgentPerformance"
                        checked={dashboardSettings.showAgentPerformance}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showAgentPerformance" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show agent performance metrics</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showCustomerSatisfaction" className="form-label settings__label">
                      Customer Satisfaction
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showCustomerSatisfaction"
                        name="showCustomerSatisfaction"
                        checked={dashboardSettings.showCustomerSatisfaction}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showCustomerSatisfaction" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show customer satisfaction ratings</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showTicketAgeAnalysis" className="form-label settings__label">
                      Ticket Age Analysis
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showTicketAgeAnalysis"
                        name="showTicketAgeAnalysis"
                        checked={dashboardSettings.showTicketAgeAnalysis}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showTicketAgeAnalysis" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show analysis of ticket age and resolution time</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showResponseTimeMetrics" className="form-label settings__label">
                      Response Time Metrics
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showResponseTimeMetrics"
                        name="showResponseTimeMetrics"
                        checked={dashboardSettings.showResponseTimeMetrics}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showResponseTimeMetrics" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show response time metrics compared to targets</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showQuickActions" className="form-label settings__label">
                      Quick Actions Panel
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showQuickActions"
                        name="showQuickActions"
                        checked={dashboardSettings.showQuickActions}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showQuickActions" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show quick action buttons for common operations</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showUpcomingBreaches" className="form-label settings__label">
                      Upcoming SLA Breaches
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showUpcomingBreaches"
                        name="showUpcomingBreaches"
                        checked={dashboardSettings.showUpcomingBreaches}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showUpcomingBreaches" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show tickets approaching SLA deadline</p>
                </div>
                
                <div className="form-group">
                  <div className="settings__toggle-group">
                    <label htmlFor="showDepartmentView" className="form-label settings__label">
                      Department View
                    </label>
                    <div className="settings__toggle">
                      <input
                        type="checkbox"
                        id="showDepartmentView"
                        name="showDepartmentView"
                        checked={dashboardSettings.showDepartmentView}
                        onChange={handleDashboardSettingChange}
                        className="settings__toggle-input"
                      />
                      <label htmlFor="showDepartmentView" className="settings__toggle-label">
                        <span className="settings__toggle-slider"></span>
                      </label>
                    </div>
                  </div>
                  <p className="settings__help-text">Show department-specific ticket breakdown</p>
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
      </div>
    </div>
  );
};

export default Settings;