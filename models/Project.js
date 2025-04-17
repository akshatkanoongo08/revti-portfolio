const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  image: {
    url: String,
    public_id: String
  },
  categories: [{
    type: String,
    required: true
  }],
  description: {
    type: String,
    required: true
  },
  client: {
    type: String
  },
  task: {
    type: String
  },
  role: [{
    type: String
  }],
  date: {
    type: Date
  },
  categoryYear: {
    type: String
  },
  liveSite: {
    type: String
  },
  gallery: [{
    url: String,
    public_id: String
  }],
  projectLink: {
    type: String,
    default: '/portfolio-single'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);