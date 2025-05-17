require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const adminData = {
      username: 'admin@gmail.com', // Change this to your preferred username
      password: 'djakshat' // Change this to your preferred password
    };

    const admin = await Admin.create(adminData);
    console.log('Admin user created successfully:', admin.username);
    console.log('Admin user created successfully:', admin.password);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
  }
  process.exit();
};

createAdmin();      