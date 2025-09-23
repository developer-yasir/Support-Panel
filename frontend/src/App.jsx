import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TicketDetail from './pages/TicketDetail';
import CreateTicket from './pages/CreateTicket';
import EmailVerification from './pages/EmailVerification';
import Settings from './pages/Settings';
import Tickets from './pages/Tickets';
import Overview from './pages/Overview';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/overview" element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } />
          <Route path="/tickets" element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/ticket/new" element={
            <ProtectedRoute>
              <CreateTicket />
            </ProtectedRoute>
          } />
          <Route path="/ticket/:id" element={
            <ProtectedRoute>
              <TicketDetail />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;