const mongoose = require('mongoose');
const User = require('./models/User');
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

    // Clear existing users (optional - remove this if you want to keep existing data)
    await User.deleteMany({});
    
    // Create an initial admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@support.com',
      password: 'admin123', // This will be hashed automatically
      role: 'admin',
      company: 'System Admin'
    });
    
    await adminUser.save();
    console.log(`Created admin user: ${adminUser.email}`);

    // Create sample users for each company
    for (const company of companies) {
      const domain = company.replace(/\s+/g, '').toLowerCase() + '.com';
      
      // Create 2-3 sample users for each company
      const userCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 users per company
      
      for (let i = 0; i < userCount; i++) {
        const user = new User({
          name: `${company.replace(/\s+/g, '')} User ${i + 1}`,
          email: `user${i + 1}@${domain}`,
          password: 'password123', // This will be hashed automatically
          company: company,
          phone: `+1-555-${Math.floor(1000 + Math.random() * 9000)}`
        });

        await user.save();
        console.log(`Created user for ${company}: ${user.email}`);
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