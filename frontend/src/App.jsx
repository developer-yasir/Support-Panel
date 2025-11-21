import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import AgentLogin from './pages/AgentLogin';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import TwoFactorSetup from './pages/TwoFactorSetup';
import TwoFactorVerification from './pages/TwoFactorVerification';
import Dashboard from './pages/Dashboard';
import CreateTicket from './pages/CreateTicket';
import EmailVerification from './pages/EmailVerification';
import Settings from './pages/Settings';
import Overview from './pages/Overview';
import Contacts from './pages/Contacts';
import Companies from './pages/Companies';
import Profile from './pages/Profile';
import Reports from './pages/Reports';
import Chat from './pages/Chat';
import Tickets from './pages/Tickets';
import Agents from './pages/Agents';
import AdminDashboard from './pages/AdminDashboard';
import CompanySignup from './pages/CompanySignup';
import CompanyCreation from './pages/CompanyCreation';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import Design1 from './pages/ticketDetailDesigns/Design1';
import TicketDetails from './pages/TicketDetails';
import ErrorBoundary from './components/ErrorBoundary';

// Removed KnowledgeBase and Community imports

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/agent-login" element={<AgentLogin />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/2fa-setup" element={<TwoFactorSetup />} />
            <Route path="/2fa-verification" element={<TwoFactorVerification />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/signup" element={<CompanySignup />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Tickets />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/overview" element={
              <ProtectedRoute>
                <Overview />
              </ProtectedRoute>
            } />
            <Route path="/tickets" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Tickets />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <Contacts />
              </ProtectedRoute>
            } />
            <Route path="/companies" element={
              <ProtectedRoute>
                <Companies />
              </ProtectedRoute>
            } />
            <Route path="/agents" element={
              <ProtectedRoute>
                <Agents />
              </ProtectedRoute>
            } />
            {/* Removed Knowledge Base and Community routes */}
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/ticket/new" element={
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            } />
            <Route path="/ticket/:ticketId" element={
              <ProtectedRoute>
                <TicketDetails />
              </ProtectedRoute>
            } />
            <Route path="/testing-new-tickets" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Tickets />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <AdminProtectedRoute>
                <ErrorBoundary>
                  <AdminDashboard />
                </ErrorBoundary>
              </AdminProtectedRoute>
            } />

            <Route path="/" element={
              <Login />
            } />
            <Route path="/create-company" element={
              <ProtectedRoute>
                <CompanyCreation />
              </ProtectedRoute>
            } />
            <Route path="/app" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <Tickets />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;