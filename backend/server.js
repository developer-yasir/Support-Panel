const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const WebSocket = require('ws');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const ticketRoutes = require('./routes/tickets');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');
const contactsRoutes = require('./routes/contacts');
const companiesRoutes = require('./routes/companies');

// Initialize app
const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/companies', companiesRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Support Panel API is running' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supportpanel')
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    
    // Setup WebSocket server
    const wss = new WebSocket.Server({ server, path: '/ws' });
    
    // Store connected clients
    const clients = new Set();
    
    wss.on('connection', (ws, req) => {
      console.log('New WebSocket client connected');
      clients.add(ws);
      
      ws.on('message', (message) => {
        // Handle incoming messages from clients if needed
        console.log('Received message from client:', message.toString());
      });
      
      ws.on('close', () => {
        console.log('WebSocket client disconnected');
        clients.delete(ws);
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        clients.delete(ws);
      });
      
      // Send welcome message
      ws.send(JSON.stringify({ type: 'connected', message: 'Connected to WebSocket server' }));
    });
    
    // Function to broadcast updates to all connected clients
    global.broadcastUpdate = (data) => {
      const json = JSON.stringify(data);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(json);
        }
      });
    };
    
    // Example: broadcast ticket updates
    // This would be called from your ticket controller when tickets are created/updated
    global.broadcastTicketUpdate = (ticketData) => {
      broadcastUpdate({
        type: 'ticket_update',
        data: ticketData
      });
    };
    
    global.broadcastNewTicket = (ticketData) => {
      broadcastUpdate({
        type: 'new_ticket',
        data: ticketData
      });
    };
    
    console.log('WebSocket server running on path /ws');
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });