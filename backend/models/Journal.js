const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  mood: { type: String, default: '' },
  verseRef: { type: String, default: '' },
  isPrivate: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Journal', JournalSchema);