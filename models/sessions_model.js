const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true
  },
  session: {
    type: Object,
    required: true
  }
});

module.exports = mongoose.model('WhatsAppSession', SessionSchema);