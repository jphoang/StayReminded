var Reminder = require('./models/reminder');

module.exports = function(app) {

  // server routes ===========================================================
  // authentication routes

  app.get('/api/reminders', function (req, res) {
    Reminder.find(function(err, reminders) {
      if (err)
        res.send(err);

      res.json(reminders);
    });
  });

  app.get('/api/reminders/:id', function (req, res) {
    Reminder.find({_id : req.params.id}, function(err, reminder) {
      if (err)
        res.send(err);

      res.json(reminder);
    });
  });

  app.post('/api/reminders', function (req, res) {
    var reminder = new Reminder();

    reminder.title = req.body.title;
    reminder.endTime = new Date(req.body.endTime);

    reminder.save();

    res.json(reminder);
  });

  app.delete('/api/reminders/:id', function (req, res) {
    Reminder.remove({_id: req.params.id }, function (err) {
      if (err)
        res.send(err);

      res.json({
        status  : 200,
        success : 'Reminder Deleted Successfully'
      }
    });
  });

  // frontend routes =========================================================
  // route to handle all angular requests
  app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load our public/index.html file
  });
};