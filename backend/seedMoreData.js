const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Ticket = require('./models/Ticket');
const Comment = require('./models/Comment');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Additional companies to seed
const additionalCompanies = [
  'Tech Solutions Inc',
  'Global Services LLC',
  'Digital Innovations',
  'Enterprise Systems',
  'Cloud Computing Co',
  'Data Analytics Pro',
  'Secure Networks',
  'Mobile First Ltd',
  'Web Development Hub',
  'E-commerce Experts'
];

const roles = ['admin', 'company_manager', 'support_agent', 'customer'];

const seedMoreData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supportpanel');
    console.log('Connected to MongoDB');

    // Create additional companies
    console.log('Creating additional companies...');
    const createdCompanies = [];
    
    for (const companyName of additionalCompanies) {
      const subdomain = companyName.replace(/\s+/g, '').toLowerCase();

      // Check if company already exists
      let company = await Company.findOne({ name: companyName });
      if (!company) {
        company = new Company({
          name: companyName,
          subdomain: subdomain,
          billingEmail: `billing@${subdomain}.com`,
          contactEmail: `contact@${subdomain}.com`,
          plan: ['free', 'starter', 'professional', 'enterprise'][Math.floor(Math.random() * 4)],
          features: {
            agentSeats: Math.floor(Math.random() * 20) + 5, // 5-25 seats
            ticketVolume: Math.floor(Math.random() * 2000) + 500, // 500-2500 tickets
            customFields: Math.random() > 0.3,
            reporting: Math.random() > 0.4,
            apiAccess: Math.random() > 0.7,
            customBranding: Math.random() > 0.6,
            sso: Math.random() > 0.8
          }
        });

        await company.save();
        console.log(`Created company: ${companyName} with subdomain: ${subdomain}`);
      } else {
        console.log(`Company ${companyName} already exists`);
      }
      
      createdCompanies.push(company);
    }

    // Add more agents to existing and new companies
    console.log('Adding more agents to companies...');
    const allCompanies = await Company.find({});
    
    for (const company of allCompanies) {
      // Add 3-5 more agents to each company
      const agentCount = Math.floor(Math.random() * 3) + 3; // 3-5 agents
      
      for (let i = 0; i < agentCount; i++) {
        const agentEmail = `agent${i + 1}@${company.subdomain}.com`;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: agentEmail });
        if (!existingUser) {
          const agent = new User({
            name: `${company.name.replace(/\s+/g, '')} Agent ${i + 1}`,
            email: agentEmail,
            password: 'password123', // This will be hashed automatically
            role: 'support_agent',
            isEmailVerified: true,
            companyId: company._id
          });

          await agent.save();
          console.log(`Created agent for ${company.name}: ${agentEmail}`);
        } else {
          console.log(`Agent ${agentEmail} already exists for ${company.name}`);
        }
      }
      
      // Add a company manager
      const managerEmail = `manager@${company.subdomain}.com`;
      const existingManager = await User.findOne({ email: managerEmail });
      if (!existingManager) {
        const manager = new User({
          name: `${company.name.replace(/\s+/g, '')} Manager`,
          email: managerEmail,
          password: 'password123',
          role: 'company_manager',
          isEmailVerified: true,
          companyId: company._id
        });

        await manager.save();
        console.log(`Created manager for ${company.name}: ${managerEmail}`);
      } else {
        console.log(`Manager ${managerEmail} already exists for ${company.name}`);
      }
    }

    // Create additional tickets for all companies
    console.log('Creating additional tickets...');
    const allUsers = await User.find({}).populate('companyId');
    
    const ticketSubjects = [
      'Server downtime issue',
      'Database connection error',
      'API endpoint not responding',
      'User authentication problem',
      'Payment processing failure',
      'Mobile app crashes',
      'Email notifications not sending',
      'UI layout broken on mobile',
      'Slow loading times',
      'Integration with third-party service',
      'Data export not working',
      'User permissions not applied',
      'File upload issues',
      'Report generation error',
      'Dashboard not updating in real-time',
      'Password reset not working',
      'Two-factor authentication issues',
      'API rate limiting too restrictive',
      'Missing invoices in system',
      'Credit card validation error'
    ];

    const ticketDescriptions = [
      'Customer is experiencing issues with the service and needs urgent assistance.',
      'This is affecting multiple users and requires immediate attention.',
      'The issue is causing downtime for our client-facing applications.',
      'User reports that the feature is not working as expected.',
      'Error occurs randomly and is difficult to reproduce.',
      'The problem occurs when using a specific browser or device.',
      'Customer has been experiencing this issue for several days.',
      'This is a high-priority issue affecting our premium clients.',
      'The system is responding slowly, affecting user experience.',
      'Integration with external service is failing intermittently.',
      'Multiple users have reported the same issue in the last hour.',
      'This issue has caused data inconsistencies that need to be resolved.',
      'The error message is not descriptive enough for users to understand.',
      'The issue occurs during peak usage hours.',
      'This is blocking user workflow and needs immediate attention.',
      'Customer has escalated this issue due to business impact.',
      'The issue appears to be related to a recent system update.',
      'This is affecting a critical business function.',
      'The issue is causing data loss that needs to be recovered.',
      'Customer is unable to access important functionality.'
    ];

    const priorities = ['low', 'medium', 'high', 'urgent'];
    const statuses = ['open', 'in_progress', 'resolved', 'closed'];
    
    // Create 10-15 tickets per company
    for (const company of allCompanies) {
      const companyUsers = allUsers.filter(user => user.companyId._id.toString() === company._id.toString());
      
      for (let i = 0; i < 15; i++) {
        const randomUserIdx = Math.floor(Math.random() * companyUsers.length);
        const creator = companyUsers[randomUserIdx];
        
        // Get another random user to assign to (could be the same)
        const assigneeIdx = Math.floor(Math.random() * companyUsers.length);
        const assignee = companyUsers[assigneeIdx];
        
        const ticket = new Ticket({
          title: ticketSubjects[Math.floor(Math.random() * ticketSubjects.length)],
          description: ticketDescriptions[Math.floor(Math.random() * ticketDescriptions.length)],
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          escalationLevel: Math.floor(Math.random() * 3) + 1, // 1-3
          dueDate: new Date(Date.now() + Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000), // 0-14 days from now
          createdBy: creator._id,
          assignedTo: assignee._id,
          companyId: company._id
        });

        await ticket.save();
        console.log(`Created ticket for ${company.name}: ${ticket.title}`);
      }
    }

    // Create comments for tickets
    console.log('Creating comments for tickets...');
    const allTickets = await Ticket.find({}).populate('companyId');
    
    const commentTemplates = [
      'Thank you for reporting this issue. We are currently investigating.',
      'I have reproduced the issue and am working on a solution.',
      'This has been fixed and deployed to production.',
      'Could you please provide more details about when this occurs?',
      'The issue has been escalated to our senior development team.',
      'A temporary workaround is available while we fix the root cause.',
      'This issue is related to a third-party service that is experiencing problems.',
      'I will update you once I have more information about the resolution timeline.',
      'The fix has been implemented and is being tested.',
      'This is scheduled to be fixed in the next release.',
      'Could you please try clearing your browser cache and trying again?',
      'We have identified the root cause of the issue.',
      'I will need to escalate this to our infrastructure team.',
      'A patch has been deployed to resolve this issue.',
      'The issue has been resolved. Please let us know if you experience any further problems.',
      'We are monitoring this issue closely.',
      'This issue has been merged with a similar ticket for tracking purposes.',
      'The fix is now in the testing phase.',
      'We appreciate your patience while we resolve this issue.',
      'This issue is on our roadmap for the next quarter.'
    ];

    // Add 2-5 comments to each ticket
    for (const ticket of allTickets) {
      const ticketUsers = allUsers.filter(user => 
        user.companyId._id.toString() === ticket.companyId._id.toString()
      );
      
      const commentCount = Math.floor(Math.random() * 4) + 2; // 2-5 comments
      
      for (let i = 0; i < commentCount; i++) {
        const randomUserIdx = Math.floor(Math.random() * ticketUsers.length);
        const commentUser = ticketUsers[randomUserIdx];
        
        const comment = new Comment({
          content: commentTemplates[Math.floor(Math.random() * commentTemplates.length)],
          ticket: ticket._id,
          createdBy: commentUser._id,
          companyId: ticket.companyId._id
        });

        await comment.save();
        console.log(`Created comment for ticket: ${ticket.title}`);
      }
    }

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedMoreData();