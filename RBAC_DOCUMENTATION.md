# Support Panel - Role-Based Access Control (RBAC) System

## Overview
The Support Panel now implements a comprehensive role-based access control system with granular permissions for different user types.

## User Roles

### 1. Admin (`admin`)
- **Access Level**: Full administrative access to company features
- **Permissions**:
  - Manage company settings and billing
  - Create, update, and delete users/agents
  - Access all reports and analytics
  - Manage company information
  - Delete tickets (as needed)
  - Access to admin dashboard
  - Manage company agents

### 2. Support Agent (`support_agent`)
- **Access Level**: Standard support operations
- **Permissions**:
  - View and update tickets
  - Access basic reports
  - Update their own profile
  - Use chat functionality
  - View contacts
  - Access to agent dashboard


## Permission System

### Backend Permissions
Each role has specific permissions defined in the permission middleware:

```javascript
// Admin permissions
admin: [
  'read:dashboard', 'read:tickets', 'write:tickets', 'delete:tickets',
  'read:agents', 'write:agents', 'delete:agents', 'read:settings', 
  'write:settings', 'read:reports', 'write:reports', 'read:billing',
  'write:billing', 'read:company', 'write:company', 'read:users', 
  'write:users', 'read:contacts', 'write:contacts', 'read:chats', 'write:chats'
],

// Support Agent permissions
support_agent: [
  'read:dashboard', 'read:tickets', 'write:tickets', 'read:reports',
  'read:settings', 'write:settings', 'read:chats', 'write:chats', 'read:contacts'
],

```

### Frontend Role Hook
Use the `useRoleAccess` hook to check permissions in components:

```javascript
import { useRoleAccess } from './hooks/useRoleAccess';

const MyComponent = () => {
  const { hasPermission, canRead, canWrite, hasAnyRole } = useRoleAccess();
  
  // Check specific permissions
  if (hasPermission('write:reports')) {
    // Show report writing features
  }
  
  // Check resource access
  if (canRead('tickets')) {
    // Allow reading tickets
  }
  
  // Check for specific roles
  if (hasAnyRole(['admin', 'support_agent'])) {
    // Show agent features
  }
};
```

## Registration & Role Assignment

### Company Registration (`/signup`)
- First user (company owner) automatically gets `admin` role
- Creates dedicated company environment with subdomain
- Assigns company-specific features based on plan

### Individual Registration (`/register`)
- New users get `support_agent` role by default
- Assigned to a default company for testing purposes
- Can be invited to join existing companies by admins

## API Route Protection

### Server-Side Protection
Routes are protected using middleware in the backend:

```javascript
// Tickets route example
router.route('/').post([protect, checkPermission('write:tickets')], createTicket);
router.route('/:id').delete([checkPermission('delete:tickets'), authorize('admin')], deleteTicket);
```

### Frontend Route Protection
Use the `PermissionProtectedRoute` component for granular access control:

```javascript
<Route path="/reports" element={
  <PermissionProtectedRoute requiredPermissions={['read:reports']}>
    <Reports />
  </PermissionProtectedRoute>
} />
```

## User Interface Adaptations

### Sidebar Navigation
The sidebar now conditionally shows menu items based on user roles:
- Admins see: Overview, Tickets, Agents, Companies, Reports, Chat, Settings, Admin Dashboard
- Support Agents see: Overview, Tickets, Agents, Reports, Chat, Settings
- Company Managers see: Overview, Tickets, Agents, Reports, Chat, Settings, User Management, Partnerships

### Navbar Updates
- Role-appropriate labels are displayed (Administrator, Support Agent, Company Manager)
- Menu options are tailored to each role's permissions

## Security Features

1. **Tenant Isolation**: Each company's data is completely isolated
2. **Role-Based Middleware**: All API routes check user permissions
3. **Frontend Guards**: UI elements are hidden/shown based on user permissions
4. **Resource-Level Security**: Users can only access resources within their company

## Migration Notes

- Existing users will maintain their current roles unless explicitly changed
- New company owners will automatically receive admin privileges
- The system no longer supports the `customer` role - all non-admins are now either Support Agents or Company Managers

## Testing the System

1. Register a new company to verify the owner gets admin role
2. Register individual users to verify they receive support_agent role by default
3. Check that UI elements appear/disappear based on user roles (admin, support_agent, company_manager)
4. Verify API responses match user permissions
5. Confirm tenant isolation is working for different companies