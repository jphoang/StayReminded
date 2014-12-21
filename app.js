/*******************************************
MIDDLEWARE
*******************************************/
var express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    stormpath = require('express-stormpath'),
    moment   = require('moment'), 
    mongoose = require('mongoose');

var configDB = require('./config/database');

/*******************************************
*******************************************/

/*******************************************
APP CONFIGURATIONS
*******************************************/
var app = express();
var port = process.env.PORT || 8120;

mongoose.connect(configDB.url);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(__dirname + '/public/images/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-promise')());
app.use(express.static(path.join(__dirname, 'public')));

//Stormpath Configuration
app.use(stormpath.init(app, {
    apiKeyFile: './private/apiKey.properties',
    application: 'https://api.stormpath.com/v1/applications/xxxxxxxxxxxxxxxxxxxxxx',
    secretKey: 'xxxxxxxxxxxxxxxxxxxx',
    expandCustomData: true,
    sessionDuration: 1000 * 60 * 525949,
    enableAutoLogin: true,
    enableFacebook: true,
  	social: {
	    facebook: {
	      appId: 'xxxxxxxxxxxxxxx',
	      appSecret: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
	    },
  	},
}));

/*******************************************
*******************************************/

/*******************************************
MODELS
*******************************************/

var reminderSchema = mongoose.Schema({
    userId: String,
    title: String,
    end: { type: Date, default: moment().add(1,'hours').toDate() }
});

var Reminder = mongoose.model('Reminder', reminderSchema);

/*******************************************
*******************************************/

/*******************************************
TWILIO INTEGRATION (SCHEDULER)
*******************************************/
var twilio = require('./twilio.js');
/*******************************************
*******************************************/

/*******************************************
REST API
*******************************************/

/* GET home page */
app.get('/', stormpath.loginRequired, function(req, res) {
  if(req.user.customData.phone){
    twilio(Reminder,req.user.href, req.user.customData.phone);
  }
  res.render('index', { title: 'StayReminded', name: req.user.givenName + ' ' + req.user.surname });
});


/* GET User phone number*/
app.get('/PhoneNumber', stormpath.loginRequired, function (req, res) {
    res.send(req.user.customData.phone);
});

/*UPDATE User's phone number*/
app.post('/PhoneNumber', stormpath.loginRequired, function(req, res, next) {
  var num = req.body.phone;
  console.log(num);
  req.user.customData.phone = num;
  req.user.customData.save(function(err) {
    if (err) {
      next(err); 
    } else {
      twilio(Reminder,req.user.href, req.user.customData.phone);
      res.send('success!');
    }
  });
});

/* GET all existing reminders */
app.get('/Reminders', stormpath.loginRequired, function (req, res) {
    res.json({
        reminders: Reminder.find({userId : req.user.href})
    });
});

/* GET an existing reminder */
app.get('/Reminders/:id', stormpath.loginRequired, function (req, res) {
    res.json({
        reminders: Reminder.find({_id : req.params.id})
    });
});

/*CREATE a new reminder */
app.post('/Reminders', stormpath.loginRequired, function (req, res) {
    var reminder = new Reminder();

    reminder.userId = req.user.href;
    reminder.title = req.body.title;
    reminder.end = new Date(req.body.end);

    reminder.save();

    res.json({"reminder": reminder });
});

/* UPDATE an existing reminder */
app.put('/Reminders/:id', stormpath.loginRequired, function (req, res) {
    Reminder.findById(req.params.id, function (err, doc) {
        doc.userId = req.user.href;
        doc.title = req.body.title;
        doc.end = new Date(req.body.end);
        doc.save();

        res.json({"reminder": doc });
    });
});

/* DELETE all existing reminders */
app.delete('/Reminders/:id', stormpath.loginRequired, function (req, res) {
    Reminder.remove({_id: req.params.id }, function (err) {
        console.log(req.params.id)
        if (err) console.log('Error deleting reminder', err);
        res.json({"message": "All reminders successfully deleted"});
    });
});

/* DELETE all existing reminders */
app.delete('/Reminders', stormpath.loginRequired, function (req, res) {
    Reminder.remove({userId: req.user.href }, function (err) {
        if (err) console.log('Error deleting reminder', err);
        res.json({"message": "All reminders successfully deleted"});
    });
});

/*******************************************
*******************************************/

/*******************************************
EXCEPTION HANDLING
*******************************************/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

/*******************************************
*******************************************/

/*******************************************
LAUNCH CONFIGURATIONS
*******************************************/

app.listen(port);
console.log('Listening on port ' + port);

/*******************************************
*******************************************/

module.exports = app;

