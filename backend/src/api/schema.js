const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    min: 6,
    max: 64
  },
  pwd: {
    type: String,
    required: true,
    min: 3,
    max: 1024,
  }
});

const flashcardSchema = new mongoose.Schema({
  deck: {
    type: String,
    required: true
  },
  front: {
    type: String,
    required: true
  },
  back: {
    type: String,
    required: true
  },
});

const deckLogSchema = new mongoose.Schema({
  deck: {
    type: String,
    required: true
  },
  last_changed: {
    type: Date,
    required: true
  },
});

module.exports.User = mongoose.model('User', userSchema);
module.exports.FlashCard = mongoose.model('FlashCard', flashcardSchema);
module.exports.DeckLog = mongoose.model('DeckLog', deckLogSchema);
