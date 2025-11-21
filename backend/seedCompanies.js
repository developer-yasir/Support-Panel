const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const companies = [
  'Sharaf DG',
  'RAK Ceramics', 
  'ASC',
  'Ecovyst',
  'LLR',
  'Rubaiyat',
  'Abu Dhabi Ports',
  'Innovent'
];

const seedCompanies = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/supportpanel');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Company.deleteMany({});
    await User.deleteMany({});
    
    // Create companies first
    const createdCompanies = [];
    for (const companyName of companies) {
      const subdomain = companyName.replace(/\s+/g, '').toLowerCase();
      
      const company = new Company({
        name: companyName,
        subdomain: subdomain,
        billingEmail: `billing@${subdomain}.com`,
        contactEmail: `contact@${subdomain}.com`,
        plan: 'starter',
        features: {
          agentSeats: 3,
          ticketVolume: 500,
          customFields: true,
          reporting: true,
          apiAccess: false,
          customBranding: false,
          sso: false
        }
      });
      
      await company.save();
      createdCompanies.push(company);
      console.log(`Created company: ${companyName} with subdomain: ${subdomain}`);
    }

    // Create an initial admin user
    const adminCompany = createdCompanies[0]; // Use first company
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@support.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      company: 'System Admin',
      companyId: adminCompany._id
    });
    
    await adminUser.save();
    console.log(`Created admin user: ${adminUser.email}`);

    // Create sample users for each company
    for (let i = 0; i < createdCompanies.length; i++) {
      const company = createdCompanies[i];
      const domain = company.subdomain + '.com';
      
      // Create 2-3 sample users for each company
      const userCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 users per company
      
      for (let j = 0; j < userCount; j++) {
        const user = new User({
          name: `${company.name.replace(/\s+/g, '')} User ${j + 1}`,
          email: `user${j + 1}@${domain}`,
          password: 'password123', // This will be hashed automatically
          company: company.name,
          phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`,
          companyId: company._id
        });

        await user.save();
        console.log(`Created user for ${company.name}: ${user.email}`);
      }
    }

    console.log('Companies seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding companies:', error);
    process.exit(1);
  }
};

seedCompanies();