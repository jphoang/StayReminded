var credentials = require('./config/twilio');
var client = require('twilio')(credentials.accountSid, credentials.authToken);

module.exports = function (Reminder) {
  function checkReminders () {
    Reminder.find({ 'endTime': { $lt: Date.now() } }, function (err, reminders) {
      if (err) {
        console.log(err);
        return;
      }
      for (var i = reminders.length - 1; i >= 0; i--) {
        var reminder = reminders[i];
        if (!reminder.isCompleted) {
          reminder.isCompleted = true
          reminder.save();
              
          client.sms.messages.create({
            body: reminder.title,
            to: '',
            from: '+12262715607'
          }, function(err, message) {
            if (err) {
              console.log(err);
              return;
            }
            reminder.remove();
          });
        }
      }
    });
  }
  setInterval(checkReminders, 10000);
  checkReminders();
};