var express = require('express');
var router = express.Router();
var Room = require('../controllers/room.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee']),Room.getAll);
router.get('/:id',Auth(['employee']),Room.getById);
router.post('/',Auth(['employee']),Room.create);
router.patch('/:id',Auth(['employee']),Room.update);
router.delete('/:id',Auth(['employee']),Room.delete);

//upload
router.post('/upload-cover/:id',Auth(['employee']),Room.uploadCoverImage);

module.exports = router;