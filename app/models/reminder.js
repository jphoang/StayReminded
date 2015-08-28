var mongoose = require('mongoose');

var reminderSchema = mongoose.Schema({
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  endTime: { type: Date, default: Date.now() }
});

module.exports = mongoose.model('Reminder', reminderSchema);