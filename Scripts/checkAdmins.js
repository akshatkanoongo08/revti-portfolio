// checkAdmins.js
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const checkAdmins = async () => {
  let connection;
  try {
    // Connect to MongoDB
    connection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all admins
    const admins = await Admin.find({}).select('-password');
    console.log('\nCurrent admin users:');
    console.log(JSON.stringify(admins, null, 2));

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    process.exit();
  }
};

// Execute the function
checkAdmins();