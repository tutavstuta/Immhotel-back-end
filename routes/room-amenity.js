var express = require('express');
var router = express.Router();
var RoomAmenity = require('../controllers/room-amenity.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee','customer']),RoomAmenity.getAll);
router.get('/:id',Auth(['employee']),RoomAmenity.getById);
router.post('/',Auth(['employee']),RoomAmenity.create);
router.patch('/:id',Auth(['employee']),RoomAmenity.update);
router.delete('/:id',Auth(['employee']),RoomAmenity.delete);

module.exports = router