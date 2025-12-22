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
const chatRoutes = require('./routes/chat');
const twoFactorRoutes = require('./routes/twoFactor');
const projectsRoutes = require('./routes/projects');

// Import tenant middleware first
const { tenantMiddleware } = require('./middlewares/tenantMiddleware');

// Initialize main app
const app = express();

// Middleware for main app
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Main API routes (for main domain like app.yourapp.com)
app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);  // Apply tenant context after auth in route file
app.use('/api/comments', commentRoutes);  // Apply tenant context after auth in route file
app.use('/api/users', userRoutes);  // Apply tenant context after auth in route file
app.use('/api/contacts', contactsRoutes);  // Apply tenant context after auth in route file
app.use('/api/companies', companiesRoutes);  // Apply tenant context after auth in route file
app.use('/api/chat', chatRoutes);  // Apply tenant context after auth in route file
app.use('/api/2fa', twoFactorRoutes);  // Apply tenant context after auth in route file
app.use('/api/projects', projectsRoutes);  // Apply tenant context after auth in route file

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
        try {
          const parsedMessage = JSON.parse(message.toString());
          console.log('Received message from client:', parsedMessage);

          // Handle chat messages
          if (parsedMessage.type === 'chat_message' && parsedMessage.message) {
            // Broadcast the message to all connected clients except the sender
            // In a real implementation, you would only send to participants in the conversation
            const json = JSON.stringify(parsedMessage);
            clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(json);
              }
            });

            // Also broadcast to the sender so they see their message reflected
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(json);
            }
          }
        } catch (error) {
          console.error('Error parsing received message:', error);
        }
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

    // Store WebSocket connections by user ID
    const userConnections = new Map(); // userId -> Set of WebSocket connections

    // Function to broadcast updates to all connected clients
    global.broadcastUpdate = (data) => {
      const json = JSON.stringify(data);
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(json);
        }
      });
    };

    // Function to broadcast chat messages to specific conversation participants
    global.broadcastChatMessage = async (conversationId, messageData) => {
      const json = JSON.stringify(messageData);

      // For now, broadcast to all clients
      // In a real implementation, you would check who's in the conversation
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