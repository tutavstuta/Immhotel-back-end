var express = require('express');
var router = express.Router();
var Hotel = require('../controllers/hotel.controller');
var Uplode = require('../controllers/hotel.upload.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee']),Hotel.getAll);
router.get('/:id',Auth(['employee']),Hotel.getById);
router.post('/create',Auth(['employee']),Hotel.create);
router.post('/upload',Auth(['employee']),Uplode.hotelUpload);
router.delete('/upload/:id',Auth(['employee']),Uplode.deleteHotelImage);
router.patch('/:id',Auth(['employee']),Hotel.update);

module.exports = router;