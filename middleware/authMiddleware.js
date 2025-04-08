const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
    let token;

    try {
        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                // Get token from header
                token = req.headers.authorization.split(' ')[1];

                // Verify token
                const decoded = jwt.verify(token, process.env.JWT_SECRET);

                // Get admin from token
                req.admin = await Admin.findById(decoded.id).select('-password');

                next();
            } catch (error) {
                console.error('Token verification failed:', error);
                res.status(401).json({
                    success: false,
                    message: 'Not authorized, token failed'
                });
            }
        }

        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized, no token'
            });
        }
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};

// Optional: Add other middleware functions
const isAdmin = (req, res, next) => {
    if (req.admin) {
        next();
    } else {
        res.status(401).json({
            success: false,
            message: 'Not authorized as an admin'
        });
    }
};

module.exports = { protect, isAdmin };