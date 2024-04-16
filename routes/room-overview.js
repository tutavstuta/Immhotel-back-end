var express = require('express');
var router = express.Router();
var RoomOverview = require('../controllers/room-overview.controller');
var Auth = require('../middleware/auth');

router.get('/',Auth(['employee','customer']),RoomOverview.getAll);
router.get('/:id',Auth(['employee']),RoomOverview.getById);
router.post('/',Auth(['employee']),RoomOverview.create);
router.patch('/:id',Auth(['employee']),RoomOverview.update);
router.delete('/:id',Auth(['employee']),RoomOverview.delete);

module.exports = router