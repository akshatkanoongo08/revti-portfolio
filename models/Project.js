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
}, { _id: false });

const projectSchema = new mongoose.Schema({
  pdf: {
    url: { type: String },
    public_id: { type: String }
  },
  pdfUrl: {
    type: String
  },
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
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
  timeline: {
    type: String
  },
  featured: {
    type: Boolean,
    default: false
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