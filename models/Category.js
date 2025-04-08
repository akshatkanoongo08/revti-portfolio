const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: String,
    required: true,
    unique: true
  },
  count: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Category', categorySchema);