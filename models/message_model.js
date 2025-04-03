const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  chatId: String,
  sender: String,
  message: String,
  timestamp: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;