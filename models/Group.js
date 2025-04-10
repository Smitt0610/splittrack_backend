const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: String,
    members: [
      {
        email: String,
        nickname: String,
      },
    ],
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
  });
  

module.exports = mongoose.model('Group', GroupSchema);
