var express = require('express');
var router = express.Router();
var Room = require('../controllers/room.controller');
var RoomImage = require('../controllers/room-image.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee']),Room.getAll);
router.get('/:id',Auth(['employee']),Room.getById);
router.put('/:id',Auth(['employee']),Room.updateRoomMainDetail);
router.post('/available',Auth(['employee']),Room.search);
router.post('/',Auth(['employee']),Room.create);
router.patch('/:id',Auth(['employee']),Room.update);
router.delete('/:id',Auth(['employee']),Room.delete);

//upload
router.post('/upload-cover/:id',Auth(['employee']),Room.uploadCoverImage);
router.post('/image/:room',Auth(['employee']),RoomImage.uploadRoomImage);
router.delete('/image/:id',Auth(['employee']),RoomImage.deleteRoomImage);

module.exports = router;