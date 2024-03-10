var express = require('express');
var router = express.Router();
var Customer = require('../controllers/customer.controller');
var Auth = require('../middleware/auth');

router.post('/signup',Customer.signup);

module.exports = router;