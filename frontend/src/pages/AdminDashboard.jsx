import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../pages/FreshdeskStyles.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'support_agent', // default role
    company: '',
    isActive: true
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      setErrorMessage('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/register', newUser);
      setUsers([...users, response.data]);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'support_agent',
        company: '',
        isActive: true
      });
      setSuccessMessage('User created successfully! Login details have been generated.');
      setShowCreateForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error creating user:', error);
      setErrorMessage(error.response?.data?.message || 'Failed to create user');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      const response = await api.put(`/users/${userId}/toggle-status`, {
        isActive: !currentStatus
      });
      
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: response.data.isActive } : user
      ));
      
      setSuccessMessage(`User status updated successfully`);
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating user status:', error);
      setErrorMessage('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        setSuccessMessage('User deleted successfully');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Error deleting user:', error);
        setErrorMessage('Failed to delete user');
      }
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccessMessage('Copied to clipboard!');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  return (
    <div className="freshdesk-dashboard">
      <Navbar />
      <div className="freshdesk-header">
        <div className="freshdesk-header-content">
          <h1 className="freshdesk-filter-title">Admin Dashboard</h1>
          <div className="freshdesk-header-actions">
            <button 
              className="freshdesk-new-ticket-btn"
              onClick={() => setShowCreateForm(!showCreateForm)}
            >
              <svg className="freshdesk-btn-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {showCreateForm ? 'Cancel' : 'Create User'}
            </button>
          </div>
        </div>
      </div>
      <div className="freshdesk-layout">
        <Sidebar />
        
        <div className="freshdesk-content">
          <div className="freshdesk-main-content">
            <div className="freshdesk-ticket-list-header">
              <div className="freshdesk-bulk-actions">
                <h2>Manage Users</h2>
              </div>
              <div className="freshdesk-ticket-count">
                {users.length} {users.length === 1 ? 'user' : 'users'}
              </div>
            </div>

            {successMessage && (
              <div className="freshdesk-loading" style={{ color: '#15803d', backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div className="freshdesk-loading" style={{ color: '#b91c1c', backgroundColor: '#fee2e2', border: '1px solid #fecaca', padding: '10px', borderRadius: '5px', marginBottom: '10px' }}>
                {errorMessage}
              </div>
            )}

            {showCreateForm && (
              <div className="freshdesk-filter-sidebar" style={{ marginBottom: '20px' }}>
                <h3>Create New User</h3>
                <form onSubmit={handleCreateUser}>
                  <div className="filter-group">
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="freshdesk-filter-input"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="freshdesk-filter-input"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      className="freshdesk-filter-input"
                      value={newUser.password}
                      onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                      required
                      minLength="6"
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="company">Company</label>
                    <input
                      type="text"
                      id="company"
                      className="freshdesk-filter-input"
                      value={newUser.company}
                      onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                    />
                  </div>
                  
                  <div className="filter-group">
                    <label htmlFor="role">Role</label>
                    <select
                      id="role"
                      className="freshdesk-filter-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    >
                      <option value="support_agent">Support Agent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  
                  <div className="filter-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={newUser.isActive}
                        onChange={(e) => setNewUser({...newUser, isActive: e.target.checked})}
                      />
                      {' '}Active User (can login)
                    </label>
                  </div>
                  
                  <button type="submit" className="freshdesk-new-ticket-btn" style={{ width: '100%' }}>
                    Create User
                  </button>
                </form>
              </div>
            )}

            {loading ? (
              <div className="freshdesk-loading">
                <div className="freshdesk-spinner"></div>
                <p>Loading users...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="freshdesk-empty-state">
                <svg className="freshdesk-empty-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <h3>No users found</h3>
                <p>Create your first user using the form above</p>
              </div>
            ) : (
              <table className="freshdesk-ticket-table">
                <thead>
                  <tr>
                    <th width="40">#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th width="150">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user._id} className="freshdesk-ticket-row">
                      <td>{index + 1}</td>
                      <td>
                        <div className="freshdesk-ticket-subject">{user.name}</div>
                      </td>
                      <td>
                        <div>{user.email}</div>
                      </td>
                      <td>
                        <div>{user.company || 'N/A'}</div>
                      </td>
                      <td>
                        <span className={`freshdesk-status-badge ${user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                          {user.role === 'admin' ? 'Admin' : 'Support Agent'}
                        </span>
                      </td>
                      <td>
                        <span 
                          className={`freshdesk-status-badge ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleToggleUserStatus(user._id, user.isActive)}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <button 
                            className="freshdesk-bulk-action-btn"
                            onClick={() => copyToClipboard(`${user.email}\nPassword: [Provided During Creation]`)}
                            title="Copy login credentials"
                          >
                            Copy Login
                          </button>
                          <button 
                            className="freshdesk-bulk-action-btn"
                            style={{ backgroundColor: '#f87171', color: '#7f1d1d' }}
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;