var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
var cors = require('cors');
var connectDatabase = require('./config/mongodb');

connectDatabase();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employeeRouter = require('./routes/employee');
var hotelRouter = require('./routes/hotel');
var roomRouter = require('./routes/room');
var roomOverviewRouter = require('./routes/room-overview');
var roomAmenityRouter = require('./routes/room-amenity');
var promotionRouter = require('./routes/promotion');
var customerRouter = require('./routes/customer');

var app = express();
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../uploads')));
app.use('/imm_hotel',express.static(path.join(__dirname, '../uploads')));

const prefix ='/imm_hotel'
app.use(prefix+'/', indexRouter);
app.use(prefix+'/users', usersRouter);
app.use(prefix+'/employee', employeeRouter);
app.use(prefix+'/hotel', hotelRouter);
app.use(prefix+'/room', roomRouter);
app.use(prefix+'/room-overview', roomOverviewRouter);
app.use(prefix+'/room-amenity', roomAmenityRouter);
app.use(prefix+'/promotion', promotionRouter);
app.use(prefix+'/customer', customerRouter);

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
