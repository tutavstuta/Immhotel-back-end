var express = require('express');
var router = express.Router();
var Customer = require('../controllers/customer.controller');
var Auth = require('../middleware/auth');

router.post('/signup',Customer.signup);
router.post('/login',Customer.login);
router.get('/me',Auth(['customer']),Customer.getMe);
router.get('/roomlist',Auth(['customer']),Customer.roomlist);
router.get('/roomdetail/:id',Auth(['customer']),Customer.roomDetail);

module.exports = router;