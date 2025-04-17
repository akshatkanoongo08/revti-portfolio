const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  public_id: {
    type: String,
    required: true
  }
}, { _id: false }); // Prevents automatic _id creation for subdocs

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: imageSchema,
    required: false
  },
  categories: [{
    type: String,
    required: true,
    trim: true
  }],
  description: {
    type: String,
    required: true
  },
  client: {
    type: String,
    trim: true
  },
  task: {
    type: String
  },
  role: [{
    type: String,
    trim: true
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
  gallery: {
    type: [imageSchema],
    default: []
  },
  projectLink: {
    type: String,
    default: '/portfolio-single'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);