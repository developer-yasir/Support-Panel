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
  if (loading) return <div className="loading">Loading profile...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Profile Settings
        </h1>
        <p className="section-subtitle">Manage your personal information and account details</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
            <h4 className="settings__subsection-title">Personal Information</h4>
            <div className="form-group">
              <label htmlFor="name" className="form-label settings__label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={profile.name}
                onChange={onInputChange}
                className="form-control"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group cursor-not-allowed opacity-70">
              <label htmlFor="email" className="form-label settings__label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                readOnly
                className="form-control"
                disabled
              />
              <p className="settings__help-text">Email address cannot be changed. Contact support for assistance.</p>
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label settings__label">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={onInputChange}
                className="form-control"
                placeholder="Enter your phone number"
              />
            </div>

            <div className="divider mt-4 mb-4"></div>

            <h4 className="settings__subsection-title">Profile Visibility</h4>
            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="showEmail" className="form-label settings__label">
                  Show Email to Team
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="showEmail"
                    name="showEmail"
                    checked={profile.showEmail}
                    onChange={onInputChange}
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
                  Show Phone to Team
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="showPhone"
                    name="showPhone"
                    checked={profile.showPhone}
                    onChange={onInputChange}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="showPhone" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            <div className="settings__actions">
              <button
                className="btn btn--primary"
                onClick={onSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Settings Section Component
const NotificationSettingsSection = ({ settings, onInputChange, onSubmit, saving, loading }) => {
  if (loading) return <div className="loading">Loading notification settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Notification Settings
        </h1>
        <p className="section-subtitle">Customize how and when you receive notifications</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
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
    </div>
  );
};

// Security Settings Section Component
const SecuritySettingsSection = ({ settings, onInputChange, onSubmit, saving, loading }) => {
  if (loading) return <div className="loading">Loading security settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Security Settings
        </h1>
        <p className="section-subtitle">Manage your account security preferences</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
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

              {/* Password Change Section */}
              <div className="settings__section mt-4">
                <h3 className="settings__section-title">Change Password</h3>
                <div className="form-group">
                  <label htmlFor="currentPassword" className="form-label">Current Password</label>
                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    className="form-control"
                    placeholder="Enter your current password"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword" className="form-label">New Password</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    className="form-control"
                    placeholder="Enter your new password"
                  />
                  <p className="settings__help-text">Use 8 or more characters with a mix of letters, numbers & symbols</p>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                  <input
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    type="password"
                    className="form-control"
                    placeholder="Confirm your new password"
                  />
                </div>
                <button type="button" className="btn btn--secondary mt-2" onClick={handlePasswordUpdate}>Update Password</button>
              </div>

              <div className="settings__actions mt-4">
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Security Settings'}
                </button>
                <button type="button" className="btn btn--outline ml-2">View Security Log</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// Ticket Settings Section Component
const TicketSettingsSection = ({ settings, onSave, saving, loading }) => {
  if (loading) return <div className="loading">Loading ticket settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Ticket Settings
        </h1>
        <p className="section-subtitle">Configure ticket handling and workflow preferences</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
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
                      onChange={(e) => { }} // Will be updated with proper handler
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
                  onChange={(e) => { }} // Will be updated with proper handler
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
    </div>
  );
};

// General Settings Section Component
const GeneralSettingsSection = ({ appSettings, onInputChange, onSave, saving, loading }) => {
  if (loading) return <div className="loading">Loading general settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          General Settings
        </h1>
        <p className="section-subtitle">Manage your account preferences and application settings</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
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
    </div>
  );
};

// Team Management Section Component
const TeamManagementSection = ({ companyInfo, loading, onInviteSubmit, onRemoveMember, saving }) => {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('agent');
  const [errors, setErrors] = useState({});
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', avatar: 'JD' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'agent', avatar: 'JS' }
  ]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInviteSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateEmail(inviteEmail)) {
      newErrors.invite = 'Please enter a valid email address';
    }

    if (!inviteEmail) {
      newErrors.invite = 'Email is required';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      if (onInviteSubmit) {
        onInviteSubmit({ email: inviteEmail, role: inviteRole });
      }
      // Reset form
      setInviteEmail('');
      setErrors({});
    }
  };

  const handleRemoveMember = (memberId) => {
    if (onRemoveMember) {
      onRemoveMember(memberId);
    }
    setTeamMembers(teamMembers.filter(member => member.id !== memberId));
  };

  if (loading) return <div className="loading">Loading team settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Team Management
        </h1>
        <p className="section-subtitle">Manage your team members, roles, and permissions</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
            <div className="form-group">
              <label className="form-label settings__label">Team Members</label>
              <div className="team-members-list">
                {teamMembers.map((member) => (
                  <div key={member.id} className="team-member-card">
                    <div className="team-member-info">
                      <div className="team-member-avatar">{member.avatar}</div>
                      <div className="team-member-details">
                        <h4 className="team-member-name">{member.name}</h4>
                        <p className="team-member-email">{member.email}</p>
                        <span className={`team-member-role role-${member.role}`}>
                          {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="team-member-actions">
                      <button className="btn btn--secondary btn--small">Edit</button>
                      <button
                        className="btn btn--outline btn--small"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <form onSubmit={handleInviteSubmit}>
              <div className="form-group">
                <label className="form-label settings__label">Invite New Team Member</label>
                <div className="form-row">
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className={`form-control ${errors.invite ? 'form-control--error' : ''}`}
                    style={{ flex: 2 }}
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                  <select
                    className="form-control form-control--select"
                    style={{ flex: 1, marginLeft: '10px' }}
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                  >
                    <option value="admin">Admin</option>
                    <option value="agent">Agent</option>
                    <option value="manager">Manager</option>
                  </select>
                  <button
                    type="submit"
                    className="btn btn--primary"
                    style={{ marginLeft: '10px' }}
                    disabled={saving}
                  >
                    {saving ? 'Inviting...' : 'Invite'}
                  </button>
                </div>
                {errors.invite && (
                  <div className="form-error-message">{errors.invite}</div>
                )}
              </div>
            </form>

            <div className="divider mt-4 mb-4"></div>

            <div className="form-group">
              <label className="form-label settings__label">Team Roles & Permissions</label>
              <div className="role-permissions-grid">
                <div className="role-permission-card">
                  <h4>Admin</h4>
                  <ul className="permission-list">
                    <li>All access</li>
                    <li>Manage team</li>
                    <li>View billing</li>
                    <li>Modify settings</li>
                  </ul>
                </div>
                <div className="role-permission-card">
                  <h4>Manager</h4>
                  <ul className="permission-list">
                    <li>Ticket management</li>
                    <li>Reports access</li>
                    <li>Team oversight</li>
                    <li>Analytics dashboard</li>
                  </ul>
                </div>
                <div className="role-permission-card">
                  <h4>Agent</h4>
                  <ul className="permission-list">
                    <li>Ticket handling</li>
                    <li>Customer communication</li>
                    <li>Basic reporting</li>
                    <li>Knowledge base access</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="settings__actions">
              <button type="button" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Team Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Integrations Section Component
const IntegrationsSection = ({ loading, saving, onWebhookSubmit, onWebhookRemove }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [webhooks, setWebhooks] = useState([
    { id: 1, url: 'https://example.com/webhook', active: true }
  ]);
  const [errors, setErrors] = useState({});
  const [integrationStatus, setIntegrationStatus] = useState({
    slack: false,
    jira: false,
    googleCalendar: false,
    apiAccess: true
  });

  const validateUrl = (url) => {
    const re = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return re.test(url);
  };

  const handleWebhookSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!webhookUrl) {
      newErrors.webhook = 'Webhook URL is required';
    } else if (!validateUrl(webhookUrl)) {
      newErrors.webhook = 'Please enter a valid URL';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const newWebhook = {
        id: Date.now(),
        url: webhookUrl,
        active: true
      };
      setWebhooks([...webhooks, newWebhook]);
      setWebhookUrl('');
      if (onWebhookSubmit) {
        onWebhookSubmit(newWebhook);
      }
    }
  };

  const handleWebhookRemove = (id) => {
    setWebhooks(webhooks.filter(webhook => webhook.id !== id));
    if (onWebhookRemove) {
      onWebhookRemove(id);
    }
  };

  const toggleIntegration = (integration) => {
    setIntegrationStatus(prev => ({
      ...prev,
      [integration]: !prev[integration]
    }));
  };

  if (loading) return <div className="loading">Loading integrations...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Integrations
        </h1>
        <p className="section-subtitle">Connect with external tools and services</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
            <div className="integrations-grid">
              <div className={`integration-card ${integrationStatus.slack ? 'integration-card--connected' : ''}`}>
                <div className="integration-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5ZM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6ZM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18ZM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5ZM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5ZM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12ZM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5ZM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0ZM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5Z" />
                  </svg>
                </div>
                <h4 className="integration-name">Slack</h4>
                <p className="integration-description">Connect with your Slack workspace to receive notifications</p>
                <div className="integration-actions">
                  <button
                    className={`btn btn--${integrationStatus.slack ? 'secondary' : 'primary'} btn--small`}
                    onClick={() => toggleIntegration('slack')}
                  >
                    {integrationStatus.slack ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>

              <div className={`integration-card ${integrationStatus.jira ? 'integration-card--connected' : ''}`}>
                <div className="integration-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.216.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.216-.395-.634-.936-.634Zm4.314.066c.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.216-.395-.634-.936-.634-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.216.395.634.936.634Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="integration-name">Jira</h4>
                <p className="integration-description">Sync tickets with your Jira projects</p>
                <div className="integration-actions">
                  <button
                    className={`btn btn--${integrationStatus.jira ? 'secondary' : 'primary'} btn--small`}
                    onClick={() => toggleIntegration('jira')}
                  >
                    {integrationStatus.jira ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>

              <div className={`integration-card ${integrationStatus.googleCalendar ? 'integration-card--connected' : ''}`}>
                <div className="integration-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.216.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.216-.395-.634-.936-.634Zm4.314.066c.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.216-.395-.634-.936-.634-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.216.395.634.936.634Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="integration-name">Google Calendar</h4>
                <p className="integration-description">Sync support schedules and availability</p>
                <div className="integration-actions">
                  <button
                    className={`btn btn--${integrationStatus.googleCalendar ? 'secondary' : 'primary'} btn--small`}
                    onClick={() => toggleIntegration('googleCalendar')}
                  >
                    {integrationStatus.googleCalendar ? 'Connected' : 'Connect'}
                  </button>
                </div>
              </div>

              <div className={`integration-card ${integrationStatus.apiAccess ? 'integration-card--connected' : ''}`}>
                <div className="integration-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.216.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.216-.395-.634-.936-.634Zm4.314.066c.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.216-.395-.634-.936-.634-.54 0-.828.419-.936.634a1.96 1.96 0 0 0-.189.866c0 .298.059.605.189.866.108.216.395.634.936.634Zm2.023 6.828a.75.75 0 1 0-1.06-1.06 3.75 3.75 0 0 1-5.304 0 .75.75 0 0 0-1.06 1.06 5.25 5.25 0 0 0 7.424 0Z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="integration-name">API Access</h4>
                <p className="integration-description">Generate API keys for external integrations</p>
                <div className="integration-actions">
                  <button
                    className={`btn btn--${integrationStatus.apiAccess ? 'secondary' : 'primary'} btn--small`}
                    onClick={() => toggleIntegration('apiAccess')}
                  >
                    {integrationStatus.apiAccess ? 'Manage Keys' : 'Enable'}
                  </button>
                </div>
              </div>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <form onSubmit={handleWebhookSubmit}>
              <div className="form-group">
                <label className="form-label settings__label">Webhook Settings</label>
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="https://your-webhook-url.com"
                    className={`form-control ${errors.webhook ? 'form-control--error' : ''}`}
                    style={{ flex: 1 }}
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={saving}
                  >
                    {saving ? 'Adding...' : 'Add Webhook'}
                  </button>
                </div>
                {errors.webhook && (
                  <div className="form-error-message">{errors.webhook}</div>
                )}
                <div className="webhook-list">
                  {webhooks.map((webhook) => (
                    <div key={webhook.id} className="webhook-item">
                      <span className="webhook-url">{webhook.url}</span>
                      <div className="webhook-actions">
                        <button className="btn btn--secondary btn--small">Edit</button>
                        <button
                          className="btn btn--outline btn--small"
                          onClick={(e) => {
                            e.preventDefault();
                            handleWebhookRemove(webhook.id);
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </form>

            <div className="settings__actions">
              <button type="button" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Integration Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Advanced Preferences Section Component
const AdvancedPreferencesSection = ({ loading, saving, onAdvancedSettingsSubmit }) => {
  const [advancedSettings, setAdvancedSettings] = useState({
    autoRefresh: true,
    emailTicketCreation: false,
    customTicketIds: false,
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    customFields: [
      { id: 1, name: 'Customer Priority', type: 'text', required: false },
      { id: 2, name: 'Support Region', type: 'select', required: false }
    ]
  });
  const [newCustomField, setNewCustomField] = useState({ name: '', type: 'text', required: false });

  const handleToggleChange = (settingName) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  const handleSelectChange = (settingName, value) => {
    setAdvancedSettings(prev => ({
      ...prev,
      [settingName]: value
    }));
  };

  const handleAddCustomField = () => {
    if (newCustomField.name.trim()) {
      const updatedFields = [
        ...advancedSettings.customFields,
        {
          id: Date.now(),
          name: newCustomField.name,
          type: newCustomField.type,
          required: newCustomField.required
        }
      ];
      setAdvancedSettings(prev => ({
        ...prev,
        customFields: updatedFields
      }));
      setNewCustomField({ name: '', type: 'text', required: false });
    }
  };

  const handleRemoveCustomField = (fieldId) => {
    setAdvancedSettings(prev => ({
      ...prev,
      customFields: prev.customFields.filter(field => field.id !== fieldId)
    }));
  };

  const handleAdvancedSettingsSubmit = (e) => {
    e.preventDefault();
    if (onAdvancedSettingsSubmit) {
      onAdvancedSettingsSubmit(advancedSettings);
    }
  };

  if (loading) return <div className="loading">Loading advanced settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Advanced Preferences
        </h1>
        <p className="section-subtitle">Configure advanced application features and preferences</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="autoRefresh" className="form-label settings__label">
                  Auto-refresh Dashboard
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="autoRefresh"
                    name="autoRefresh"
                    checked={advancedSettings.autoRefresh}
                    onChange={() => handleToggleChange('autoRefresh')}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="autoRefresh" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Automatically refresh dashboard data every 30 seconds</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="emailTicketCreation" className="form-label settings__label">
                  Create Tickets via Email
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="emailTicketCreation"
                    name="emailTicketCreation"
                    checked={advancedSettings.emailTicketCreation}
                    onChange={() => handleToggleChange('emailTicketCreation')}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="emailTicketCreation" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Allow customers to create tickets by emailing your support address</p>
            </div>

            <div className="form-group">
              <div className="settings__toggle-group">
                <label htmlFor="customTicketIds" className="form-label settings__label">
                  Custom Ticket IDs
                </label>
                <div className="settings__toggle">
                  <input
                    type="checkbox"
                    id="customTicketIds"
                    name="customTicketIds"
                    checked={advancedSettings.customTicketIds}
                    onChange={() => handleToggleChange('customTicketIds')}
                    className="settings__toggle-input"
                  />
                  <label htmlFor="customTicketIds" className="settings__toggle-label">
                    <span className="settings__toggle-slider"></span>
                  </label>
                </div>
              </div>
              <p className="settings__help-text">Use custom ticket identifiers instead of sequential numbers</p>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <div className="form-group">
              <label htmlFor="dateFormat" className="form-label settings__label">
                Date Format
              </label>
              <select
                id="dateFormat"
                className="form-control form-control--select"
                value={advancedSettings.dateFormat}
                onChange={(e) => handleSelectChange('dateFormat', e.target.value)}
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY (02/15/2024)</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY (15/02/2024)</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD (2024-02-15)</option>
                <option value="DD-MMM-YYYY">DD-MMM-YYYY (15-Feb-2024)</option>
              </select>
              <p className="settings__help-text">Select your preferred date format for display</p>
            </div>

            <div className="form-group">
              <label htmlFor="timeFormat" className="form-label settings__label">
                Time Format
              </label>
              <select
                id="timeFormat"
                className="form-control form-control--select"
                value={advancedSettings.timeFormat}
                onChange={(e) => handleSelectChange('timeFormat', e.target.value)}
              >
                <option value="12h">12-hour (02:30 PM)</option>
                <option value="24h">24-hour (14:30)</option>
              </select>
              <p className="settings__help-text">Select your preferred time format for display</p>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <div className="form-group">
              <label htmlFor="customFields" className="form-label settings__label">
                Custom Ticket Fields
              </label>
              <div className="custom-fields-list">
                {advancedSettings.customFields.map((field) => (
                  <div key={field.id} className="custom-field-item">
                    <input
                      type="text"
                      placeholder="Field Name"
                      className="form-control"
                      value={field.name}
                      readOnly
                    />
                    <select
                      className="form-control form-control--select"
                      value={field.type}
                      disabled
                    >
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown</option>
                      <option value="date">Date</option>
                    </select>
                    <button
                      className="btn btn--outline"
                      onClick={() => handleRemoveCustomField(field.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="custom-field-add-form">
                <div className="form-row">
                  <input
                    type="text"
                    placeholder="New field name"
                    className="form-control"
                    value={newCustomField.name}
                    onChange={(e) => setNewCustomField({ ...newCustomField, name: e.target.value })}
                  />
                  <select
                    className="form-control form-control--select"
                    value={newCustomField.type}
                    onChange={(e) => setNewCustomField({ ...newCustomField, type: e.target.value })}
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="select">Dropdown</option>
                    <option value="date">Date</option>
                  </select>
                  <button
                    className="btn btn--secondary btn--small"
                    onClick={handleAddCustomField}
                  >
                    Add Field
                  </button>
                </div>
              </div>
            </div>

            <div className="settings__actions">
              <button
                type="submit"
                className="btn btn--primary"
                onClick={handleAdvancedSettingsSubmit}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Advanced Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Support & Help Section Component
const SupportHelpSection = ({ loading }) => {
  if (loading) return <div className="loading">Loading support settings...</div>;

  return (
    <div>
      <div className="section-header">
        <h1 className="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Support & Help
        </h1>
        <p className="section-subtitle">Access documentation, contact support, and view system status</p>
      </div>

      <div className="card settings__card">
        <div className="card__body">
          <div className="settings__section">
            <div className="support-help-grid">
              <div className="support-help-card">
                <div className="support-help-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                </div>
                <h4>Documentation</h4>
                <p>Find guides, tutorials, and API documentation</p>
                <a href="#" className="btn btn--outline btn--small">View Documentation</a>
              </div>

              <div className="support-help-card">
                <div className="support-help-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4>Contact Support</h4>
                <p>Get help from our support team</p>
                <a href="#" className="btn btn--outline btn--small">Contact Support</a>
              </div>

              <div className="support-help-card">
                <div className="support-help-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4>System Status</h4>
                <p>Check the status of our services</p>
                <a href="#" className="btn btn--outline btn--small">View Status</a>
              </div>

              <div className="support-help-card">
                <div className="support-help-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4>Privacy & Compliance</h4>
                <p>Manage data privacy settings and compliance</p>
                <a href="#" className="btn btn--outline btn--small">View Details</a>
              </div>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <div className="form-group">
              <label className="form-label settings__label">Activity Log</label>
              <div className="activity-log-container">
                <div className="activity-log-header">
                  <h4 className="activity-log-title">Recent Activity</h4>
                  <div className="activity-log-actions">
                    <button className="btn btn--secondary btn--small">Export Logs</button>
                    <button className="btn btn--outline btn--small">Filter</button>
                  </div>
                </div>
                <div className="activity-log-list">
                  <div className="activity-log-item">
                    <div className="activity-log-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="activity-log-content">
                      <p>System updated to version 2.5.0</p>
                      <span className="activity-log-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-log-item">
                    <div className="activity-log-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="activity-log-content">
                      <p>Backup completed successfully</p>
                      <span className="activity-log-time">5 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-log-item">
                    <div className="activity-log-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div className="activity-log-content">
                      <p>API rate limit increased for user John Doe</p>
                      <span className="activity-log-time">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="divider mt-4 mb-4"></div>

            <div className="form-group">
              <label className="form-label settings__label">Support Preferences</label>
              <div className="form-group">
                <div className="settings__toggle-group">
                  <label htmlFor="receiveUpdates" className="form-label settings__label">
                    Receive Product Updates
                  </label>
                  <div className="settings__toggle">
                    <input
                      type="checkbox"
                      id="receiveUpdates"
                      name="receiveUpdates"
                      checked={true}
                      onChange={() => { }}
                      className="settings__toggle-input"
                    />
                    <label htmlFor="receiveUpdates" className="settings__toggle-label">
                      <span className="settings__toggle-slider"></span>
                    </label>
                  </div>
                </div>
                <p className="settings__help-text">Receive emails about new features and product improvements</p>
              </div>
            </div>

            <div className="settings__actions">
              <button className="btn btn--primary">Save Support Settings</button>
            </div>
          </div>
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
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    profileVisibility: user?.profileVisibility || 'public',
    showEmail: user?.showEmail || true,
    showPhone: user?.showPhone || false
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

  const handlePasswordUpdate = async () => {
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmNewPassword = document.getElementById('confirmNewPassword')?.value;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setSaveMessage('Please fill in all password fields');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setSaveMessage('New passwords do not match');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    if (newPassword.length < 8) {
      setSaveMessage('New password must be at least 8 characters long');
      setTimeout(() => setSaveMessage(''), 3000);
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setSaveMessage('Password updated successfully!');
      // Clear the password fields
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmNewPassword').value = '';
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to update password: ' + error.response?.data?.message || error.message);
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

  const handleInviteSubmit = async (inviteData) => {
    setSaving(true);
    try {
      // In a real implementation, you would call the API here
      // await api.post('/teams/invite', inviteData);
      setSaveMessage('Team member invited successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to invite team member: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    setSaving(true);
    try {
      // In a real implementation, you would call the API here
      // await api.delete(`/teams/members/${memberId}`);
      setSaveMessage('Team member removed successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to remove team member: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleWebhookSubmit = async (webhookData) => {
    setSaving(true);
    try {
      // In a real implementation, you would call the API here
      // await api.post('/webhooks', webhookData);
      setSaveMessage('Webhook added successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to add webhook: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleWebhookRemove = async (webhookId) => {
    setSaving(true);
    try {
      // In a real implementation, you would call the API here
      // await api.delete(`/webhooks/${webhookId}`);
      setSaveMessage('Webhook removed successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to remove webhook: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleAdvancedSettingsSubmit = async (settingsData) => {
    setSaving(true);
    try {
      // In a real implementation, you would call the API here
      // await api.put('/settings/advanced', settingsData);
      setSaveMessage('Advanced settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save advanced settings: ' + error.response?.data?.message);
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (e, section) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    switch (section) {
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
        // If dark mode setting is changed, also toggle the theme
        if (name === 'darkMode') {
          if (newValue) {
            setThemeMode('dark');
          } else {
            setThemeMode('light');
          }
        }
        break;
      default:
        break;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
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
          onSave={() => { }}
          saving={saving}
          loading={loading}
        />;
      case 'team':
        return <TeamManagementSection
          companyInfo={companyInfo}
          loading={loading}
          saving={saving}
          onInviteSubmit={handleInviteSubmit}
          onRemoveMember={handleRemoveMember}
        />;
      case 'integrations':
        return <IntegrationsSection
          loading={loading}
          saving={saving}
          onWebhookSubmit={handleWebhookSubmit}
          onWebhookRemove={handleWebhookRemove}
        />;
      case 'advanced':
        return <AdvancedPreferencesSection
          loading={loading}
          saving={saving}
          onAdvancedSettingsSubmit={handleAdvancedSettingsSubmit}
        />;
      case 'support':
        return <SupportHelpSection
          loading={loading}
        />;
      case 'billing':
        return (
          <div>
            <div className="section-header">
              <h1 className="section-title">
                <svg xmlns="http://www.w3.org/2000/svg" className="section-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Billing & Plans
              </h1>
              <p className="section-subtitle">
                Current plan: <strong>{companyInfo?.plan?.charAt(0).toUpperCase() + companyInfo?.plan?.slice(1) || 'Loading...'}</strong>
              </p>
            </div>
            <div className="card settings__card">
              <div className="card__body">
                <div className="settings__section">

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
        );
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
        <div className="settings-layout">
          {/* Sidebar Navigation */}
          <div className="settings-sidebar">
            <nav className="settings-nav">
              <div className="settings-nav__group">
                <h4 className="settings-nav__group-title">Account</h4>
                <ul className="settings-nav__list">
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'profile' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('profile')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'billing' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('billing')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Billing & Plans</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'security' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('security')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Security</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="settings-nav__group">
                <h4 className="settings-nav__group-title">Preferences</h4>
                <ul className="settings-nav__list">
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'notifications' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('notifications')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span>Notifications</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'general' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('general')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>General</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'advanced' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('advanced')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Advanced</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="settings-nav__group">
                <h4 className="settings-nav__group-title">Work</h4>
                <ul className="settings-nav__list">
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'tickets' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('tickets')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Tickets</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'team' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('team')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span>Team</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'integrations' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('integrations')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span>Integrations</span>
                    </button>
                  </li>
                </ul>
              </div>

              <div className="settings-nav__group">
                <h4 className="settings-nav__group-title">Support</h4>
                <ul className="settings-nav__list">
                  <li>
                    <button
                      className={`settings-nav__item ${activeTab === 'support' ? 'settings-nav__item--active' : ''}`}
                      onClick={() => setActiveTab('support')}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="icon settings-nav__icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Support & Help</span>
                    </button>
                  </li>
                </ul>
              </div>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="settings-content">
            {saveMessage && (
              <div className={`alert ${saveMessage.includes('successfully') ? 'alert--success' : 'alert--danger'} settings__save-message`}>
                <span>{saveMessage}</span>
              </div>
            )}

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;