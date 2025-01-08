var express = require('express');
var router = express.Router();
var Customer = require('../controllers/customer.controller');
var Booking = require('../controllers/booking.controller');
var Auth = require('../middleware/auth');
const multer = require('multer')
const upload = multer({ dest: './slip' });

router.post('/signup',Customer.signup);
router.post('/login',Customer.login);
router.patch('/editprofile',Auth(['customer']),Customer.editprofile);
router.get('/profile',Auth(['customer']),Customer.profile);
router.get('/me',Auth(['customer']),Customer.getMe);
router.get('/roomlist',Auth(['customer']),Customer.roomlist);
router.get('/roomdetail/:id',Auth(['customer']),Customer.roomDetail);

//booking
router.get('/booked',Auth(['customer']),Booking.getAll);
router.post('/searchroom',Auth(['customer']),Booking.search);
router.post('/createbooking',Auth(['customer']),Booking.create);
router.post('/sendslip',Auth(['customer']),upload.single('slip'),Booking.sendSlip);

module.exports = router;