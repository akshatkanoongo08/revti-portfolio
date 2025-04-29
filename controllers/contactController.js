const Enquiry = require('../models/Enquiry');

exports.submitContactForm = async (req, res) => {
  try {
    console.log('BODY:', req.body); // Log what's coming from frontend
    const enquiry = new Enquiry(req.body);
    await enquiry.save();
    console.log('Enquiry saved:', enquiry); // Log the saved doc
    res.status(200).json({ message: 'Message received!' });
  } catch (err) {
    console.error('Save error:', err); // Log any errors
    res.status(500).json({ message: 'Failed to process contact form.' });
  }
};