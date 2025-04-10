const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: String,
  members: [String], // Emails instead of UIDs
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Group', GroupSchema);
