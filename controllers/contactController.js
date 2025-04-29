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

// Fetch all enquiries for admin dashboard
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.status(200).json(enquiries);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch enquiries.' });
  }
};

// Delete an enquiry by ID
exports.deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Enquiry.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Enquiry not found.' });
    }
    res.status(200).json({ message: 'Enquiry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete enquiry.' });
  }
};