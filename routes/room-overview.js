var express = require('express');
var router = express.Router();
var RoomOverview = require('../controllers/room-overview.controller');
var Auth = require('../middleware/auth');

router.get('/room-overview',Auth,RoomOverview.getAll);
router.get('/room-overview/:id',Auth,RoomOverview.getById);
router.post('/room-overview',Auth,RoomOverview.create);
router.patch('/room-overview/:id',Auth,RoomOverview.update);
router.delete('/room-overview/:id',Auth,RoomOverview.delete);

module.exports = router