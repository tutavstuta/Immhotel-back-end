var express = require('express');
var router = express.Router();
var Customer = require('../controllers/customer.controller');
var Booking = require('../controllers/booking.controller');
var Auth = require('../middleware/auth');

router.post('/signup',Customer.signup);
router.post('/login',Customer.login);
router.get('/me',Auth(['customer']),Customer.getMe);
router.get('/roomlist',Auth(['customer']),Customer.roomlist);
router.get('/roomdetail/:id',Auth(['customer']),Customer.roomDetail);

//booking
router.post('/searchroom',Auth(['customer']),Booking.search);
router.post('/createbooking',Auth(['customer']),Booking.create);

module.exports = router;