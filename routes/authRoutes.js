const express = require('express');
const router = express.Router();
const { login, register, getProfile } = require('../controllers/authcontroller');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', login);
//  router.post('/register', register); // You might want to remove or protect this route after creating first admin
router.get('/profile', protect, getProfile);

module.exports = router;