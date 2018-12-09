require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var session = require('express-session');
var passport = require('./config/passportConfig');

// Mongoose stuff
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mernJwtAuth');

// var index = require('./routes/index');
// var users = require('./routes/users');
var auth = require('./routes/auth');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'client', 'build')));

//adding passport sessions to this app for use with goole oAuth
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


// Do we still need this?
app.use(function(req, res, next) {
  // before every route, attach the flash messages and current user to res.locals
  res.locals.currentUser = req.user;
  next();
});

app.use('/auth', auth);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});


module.exports = app;
