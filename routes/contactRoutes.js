const express = require('express');
const router = express.Router();
const { submitContactForm, getAllEnquiries, deleteEnquiry } = require('../controllers/contactController');

// Submit an enquiry
router.post('/', submitContactForm);
// Get all enquiries
router.get('/', getAllEnquiries);
// Delete an enquiry
router.delete('/:id', deleteEnquiry);

module.exports = router;
