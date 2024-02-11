var express = require('express');
var router = express.Router();
var Hotel = require('../controllers/hotel.controller');
var Auth = require('../middleware/auth')

router.get('/',Auth(['employee']),Hotel.getAll);
router.get('/:id',Auth(['employee']),Hotel.getById);
router.post('/create',Auth(['employee']),Hotel.create);
router.patch('/:id',Auth(['employee']),Hotel.update);

module.exports = router