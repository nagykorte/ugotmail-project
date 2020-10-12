
/////////////////
////  vars  /////
/////////////////

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const secret = 'top secret code';
const indexRouter = require('./routes/index'); // routes
const usersRouter = require('./routes/users');
const apiRouter = require('./routes/api/main');

var app = express();

/////////////////
///// views /////
/////////////////

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/////////////////
/////  db  //////
/////////////////

mongoose.connect('mongodb://localhost/mail', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

/////////////////
////  setup  ////
/////////////////

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cookieParser(secret));
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}))
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

//////////////////
////  errors  ////
//////////////////

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
