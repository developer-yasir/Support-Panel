const mongoose = require('mongoose');
const Ticket = require('./models/Ticket');
const User = require('./models/User');
const Company = require('./models/Company');
require('dotenv').config();

const seedTickets = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supportpanel');
    console.log('Connected to MongoDB');

    // Get all users to assign tickets to
    const users = await User.find({}).populate('companyId');
    if (users.length === 0) {
      console.log('No users found. Please run seedCompanies.js first to create users.');
      process.exit(1);
    }

    // Clear existing tickets (optional - remove this if you want to keep existing data)
    await Ticket.deleteMany({});
    console.log('Cleared existing tickets');

    // Sample tickets data - ticketId and companyId will be set based on the user's company
    const sampleTickets = [
      {
        title: 'Customer unable to login to dashboard',
        description: 'Customer John Smith is unable to login to the dashboard. Getting "Invalid credentials" error despite correct password.',
        priority: 'high',
        status: 'open',
        escalationLevel: 2,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdBy: users[0]._id,
        assignedTo: users[1] ? users[1]._id : null,
        companyId: users[0].companyId // Use the user's company
      },
      {
        title: 'API rate limit exceeded error',
        description: 'Our API is returning rate limit exceeded errors for premium customers.',
        priority: 'urgent',
        status: 'in_progress',
        escalationLevel: 3,
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
        createdBy: users[1] ? users[1]._id : users[0]._id,
        assignedTo: users[2] ? users[2]._id : null,
        companyId: users[1] ? users[1].companyId : users[0].companyId
      },
      {
        title: 'Billing discrepancy on last invoice',
        description: 'Customer reporting incorrect charges on the latest invoice.',
        priority: 'medium',
        status: 'in_progress',
        escalationLevel: 1,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdBy: users[2] ? users[2]._id : users[0]._id,
        assignedTo: users[0]._id,
        companyId: users[2] ? users[2].companyId : users[0].companyId
      },
      {
        title: 'Feature request - custom reporting',
        description: 'Customer requesting custom reporting dashboard for their analytics needs.',
        priority: 'low',
        status: 'closed',
        escalationLevel: 1,
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdBy: users[0]._id,
        assignedTo: users[1] ? users[1]._id : null,
        companyId: users[0].companyId
      },
      {
        title: 'Email notifications not working',
        description: 'User is not receiving email notifications for ticket updates.',
        priority: 'medium',
        status: 'resolved',
        escalationLevel: 2,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdBy: users[1] ? users[1]._id : users[0]._id,
        assignedTo: users[0]._id,
        companyId: users[1] ? users[1].companyId : users[0].companyId
      }
    ];

    // Create sample tickets
    for (const ticketData of sampleTickets) {
      const ticket = new Ticket(ticketData);
      await ticket.save();
      console.log(`Created ticket: ${ticket.title} for company ID: ${ticket.companyId}`);
    }

    console.log('Ticket seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tickets:', error);
    process.exit(1);
  }
};

seedTickets();