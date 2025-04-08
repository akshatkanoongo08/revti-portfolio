const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // Remove deprecated options
            // useCreateIndex: true,
            // useFindAndModify: false
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Handle MongoDB connection events
        mongoose.connection.on('connected', () => {
            console.log('Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('Mongoose disconnected');
        });

        // Handle application termination
        process.on('SIGINT', async () => {
            try {
                await mongoose.connection.close();
                console.log('Mongoose connection closed through app termination');
                process.exit(0);
            } catch (err) {
                console.error('Error closing Mongoose connection:', err);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;