var express = require('express');
var router = express.Router();
var Booking = require('../controllers/booking.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee']),Booking.getAll);
router.post('/range',Auth(['employee']),Booking.getOnRange);


module.exports = router;