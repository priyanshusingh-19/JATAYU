const mongoose = require('mongoose');

const CommunityMemberSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  phone: String,
  email: String,
  location: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CommunityMember', CommunityMemberSchema);
