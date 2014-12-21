/*******************************************
TWILIO CREDENTIALS
*******************************************/
var accountSID = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    authToken = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    client = require('twilio')(accountSID, authToken);
/*******************************************
*******************************************/

/*******************************************
SCHEDULED CHECK JOB
*******************************************/
module.exports = function(Reminder, id, number) {
  function checkDueReminders () {
    Reminder.find({ 'userId': id, 'end': { $lt: Date.now() } }, function (err, reminders) {
      if (err) {
        console.log(err);
        return;
      }

      //Print from end of list (FIFO)
      for (var i = reminders.length - 1; i >= 0; i--) {
        var reminder = reminders[i];

        //Create the SMS and send
        client.sms.messages.create({
          body: reminder.title,
          to: number,
          from: '+12262715607'
        }, function(err, message) {
          //Remove the reminder after sending the SMS
          reminder.remove();
          if (err) {
            console.log(err);
            return;
          }
        });             
      }
    });
  }
  //Check for due reminders every 10 seconds
  setInterval(checkDueReminders, 10000);
  checkDueReminders();
};
/*******************************************
*******************************************/
