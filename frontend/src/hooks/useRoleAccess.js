import { useAuth } from '../contexts/AuthContext';

const rolePermissions = {
  admin: [
    'read:dashboard',
    'read:tickets',
    'write:tickets',
    'delete:tickets',
    'read:agents',
    'write:agents',
    'delete:agents',
    'read:settings',
    'write:settings',
    'read:reports',
    'write:reports',
    'read:billing',
    'write:billing',
    'read:company',
    'write:company',
    'read:users',
    'write:users',
    'read:contacts',
    'write:contacts',
    'read:chats',
    'write:chats'
  ],
  support_agent: [
    'read:dashboard',
    'read:tickets',
    'write:tickets',
    'read:reports',
    'read:settings',
    'write:settings',
    'read:chats',
    'write:chats',
    'read:contacts'
  ],
  company_manager: [
    'read:dashboard',
    'read:tickets',
    'write:tickets',
    'read:agents',
    'write:agents',
    'read:settings',
    'write:settings',
    'read:reports',
    'read:users',
    'write:users',
    'delete:users',
    'read:contacts',
    'write:contacts',
    'read:chats',
    'write:chats'
  ],
};

export const useRoleAccess = () => {
  const { user } = useAuth();
  const userRole = user?.role || 'support_agent'; // Default to support_agent if no role

  const hasPermission = (permission) => {
    const permissions = rolePermissions[userRole] || [];
    return permissions.includes(permission);
  };

  const canRead = (resource) => {
    return hasPermission(`read:${resource}`);
  };

  const canWrite = (resource) => {
    return hasPermission(`write:${resource}`);
  };

  const canDelete = (resource) => {
    return hasPermission(`delete:${resource}`);
  };

  // Check if user has access to a specific role
  const hasRole = (role) => {
    return userRole === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(userRole);
  };

  return {
    userRole,
    hasPermission,
    canRead,
    canWrite,
    canDelete,
    hasRole,
    hasAnyRole
  };
};