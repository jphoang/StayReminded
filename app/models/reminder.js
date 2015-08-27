var mongoose = require('mongoose');

var reminderSchema = mongoose.Schema({
  title: { type: String, default: '' },
  end: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);