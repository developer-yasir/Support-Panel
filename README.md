# Support Panel

A MERN stack application for managing support tickets with role-based access control and comprehensive user settings.

## Features

- User Authentication (JWT)
- Role-based access (Admin, Support Agent)
- Create, read, update, and delete tickets
- Add comments to tickets
- Filter tickets by status and priority
- Comprehensive user settings and preferences
  - Profile management
  - Notification preferences
  - Security settings
  - Billing & Plans management
  - Team management
  - Integrations
  - Advanced preferences
- Responsive UI with custom CSS

## Project Structure

```
support-panel/
├── backend/    # Node.js + Express + MongoDB
├── frontend/   # React (Vite)
└── README.md   # This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/supportpanel
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRATION=24h
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following variables:
   ```env
   VITE_BACKEND_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Running Both Servers

You can run both servers simultaneously using `concurrently`:

1. From the root directory, run:
   ```bash
   npm run dev
   ```

## Usage

1. Open your browser and navigate to `http://localhost:5173`
2. Register a new account or login with existing credentials
3. Create and manage support tickets
4. Access comprehensive settings through the Settings page to customize your experience:
   - Update your profile information
   - Configure notification preferences
   - Manage security settings
   - Select and manage billing plans
   - Invite and manage team members
   - Configure integrations and webhooks
   - Adjust advanced preferences

## Role-based Access

- **Admin**: Can create, read, update, and delete all tickets and comments, manage users, and configure system settings
- **Support Agent**: Can create, read, update, and delete their own tickets and comments

## Settings Page Features

The Settings page provides a comprehensive user configuration interface with:

- **Profile Tab**: Update personal information and contact details
- **Billing & Plans**: View and manage subscription plans with different features
- **Security**: Configure authentication and security preferences
- **Notifications**: Customize notification preferences for different events
- **Tickets**: Configure default ticket settings and categories
- **Team**: Invite and manage team members (Admin only)
- **Integrations**: Configure webhooks and API integrations
- **Advanced**: Configure advanced application preferences
- **Support & Help**: Access help resources and support

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Tickets
- `POST /api/tickets` - Create a new ticket
- `GET /api/tickets` - Get all tickets (with optional filters)
- `GET /api/tickets/:id` - Get a specific ticket
- `PUT /api/tickets/:id` - Update a ticket
- `DELETE /api/tickets/:id` - Delete a ticket

### Comments
- `POST /api/comments` - Add a comment to a ticket
- `GET /api/comments/ticket/:ticketId` - Get comments for a ticket
- `PUT /api/comments/:id` - Update a comment
- `DELETE /api/comments/:id` - Delete a comment

### Settings/Preferences
- `GET /api/users/notification-settings` - Get user notification preferences
- `PUT /api/users/notification-settings` - Update user notification preferences
- `PUT /api/users/security-settings` - Update user security settings

## Development

### Backend
- Built with Node.js, Express, and MongoDB (Mongoose)
- JWT for authentication
- Role-based access control middleware

### Frontend
- Built with React and Vite
- Custom CSS for styling
- React Router for navigation
- Axios for API calls
- React Context for state management
- Comprehensive settings interface with multiple tabs and configurations

## Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

## License

MIT