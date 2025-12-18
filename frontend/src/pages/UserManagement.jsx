import { useState, useEffect } from 'react';
import { api } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../contexts/AuthContext';

const UserManagement = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'support_agent',
    isActive: true
  });

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/users');
        setUsers(response.data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle creating a new user
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/users', formData);
      setUsers([...users, response.data]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'support_agent',
        isActive: true
      });
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Failed to create user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle updating a user
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const response = await api.put(`/users/${selectedUser._id}`, formData);
      setUsers(users.map(user => user._id === selectedUser._id ? response.data : user));
      setShowEditModal(false);
      setSelectedUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  // Handle toggling user status
  const handleToggleStatus = async (user) => {
    try {
      const response = await api.put(`/users/${user._id}/toggle-status`, {
        isActive: !user.isActive
      });

      setUsers(users.map(u =>
        u._id === user._id ? { ...u, isActive: response.data.isActive } : u
      ));
    } catch (err) {
      console.error('Error toggling user status:', err);
      alert('Failed to toggle user status: ' + (err.response?.data?.message || err.message));
    }
  };

  // Open edit modal with user data
  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      isActive: user.isActive
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="dashboard__container">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading users...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <Navbar />
        <div className="dashboard__layout">
          <Sidebar />
          <div className="dashboard__container">
            <div className="alert alert--danger">
              <div className="alert__content">
                <h3 className="alert__title">Error Loading Users</h3>
                <p className="alert__description">{error}</p>
              </div>
            </div>
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
        <div className="dashboard__container">
          {/* Page Header */}
          <div className="dashboard-header__content">
            <div className="dashboard-header__title-wrapper">
              <h1 className="dashboard-header__title">
                <span className="dashboard-header__icon">👥</span>
                User Management
              </h1>
              <p className="dashboard-header__subtitle">Manage users and their roles in the system</p>
            </div>
            <div className="dashboard-header__actions">
              <button
                className="btn btn--primary dashboard-header__create-btn"
                onClick={() => setShowCreateModal(true)}
              >
                <span className="dashboard-header__btn-icon">+</span>
                Add User
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="card card__body--no-padding">
            <div className="p-4">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td className="align-middle">
                          <div className="d-flex align-items-center">
                            <div className="agent-avatar me-3">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-semibold">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">{user.email}</td>
                        <td className="align-middle">
                          <span className={`badge badge--${user.role === 'admin' ? 'primary' : user.role === 'support_agent' ? 'secondary' : 'info'}`}>
                            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        <td className="align-middle">
                          <span className={`badge badge--${user.isActive ? 'success' : 'danger'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="align-middle">
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn--outline btn--small"
                              onClick={() => openEditModal(user)}
                            >
                              Edit
                            </button>
                            <button
                              className={`btn btn--outline btn--small ${user.isActive ? 'btn--warning' : 'btn--secondary'}`}
                              onClick={() => handleToggleStatus(user)}
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              className="btn btn--danger btn--small"
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
              </div>

              {users.length === 0 && (
                <div className="empty-state">
                  <div className="empty-state__icon-wrapper">
                    <span className="empty-state__icon">👥</span>
                  </div>
                  <h3 className="empty-state__title">No users found</h3>
                  <p className="empty-state__description">Get started by adding your first user to the system</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="freshdesk-modal-overlay">
          <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', borderRadius: 'var(--border-radius-xl)' }}>
            <div className="card__header">
              <h3 className="card__title">Add New User</h3>
            </div>
            <form onSubmit={handleCreateUser} className="card__body">
              <div className="form-group">
                <label className="form-label required">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-control form-control--select"
                  required
                >
                  <option value="support_agent">Support Agent</option>
                  <option value="company_manager">Company Manager</option>
                  {currentUser?.role === 'admin' && (
                    <option value="admin">Admin</option>
                  )}
                </select>
              </div>
              <div className="form-group--checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Active User
                </label>
              </div>
              <div className="d-flex gap-3 pt-3">
                <button
                  type="button"
                  className="btn btn--secondary flex-grow-1"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary flex-grow-1"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="freshdesk-modal-overlay">
          <div className="card" style={{ maxWidth: '500px', margin: '2rem auto', borderRadius: 'var(--border-radius-xl)' }}>
            <div className="card__header">
              <h3 className="card__title">Edit User</h3>
            </div>
            <form onSubmit={handleUpdateUser} className="card__body">
              <div className="form-group">
                <label className="form-label required">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label required">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">New Password (Optional)</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Leave blank to keep current password"
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="form-control form-control--select"
                  required
                >
                  <option value="support_agent">Support Agent</option>
                  <option value="company_manager">Company Manager</option>
                  {currentUser?.role === 'admin' && (
                    <option value="admin">Admin</option>
                  )}
                </select>
              </div>
              <div className="form-group--checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="checkbox-input"
                  />
                  <span className="checkbox-custom"></span>
                  Active User
                </label>
              </div>
              <div className="d-flex gap-3 pt-3">
                <button
                  type="button"
                  className="btn btn--secondary flex-grow-1"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn--primary flex-grow-1"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;