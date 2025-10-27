var express = require('express');
var router = express.Router();
var Auth = require('../middleware/auth');
var Promotion = require('../controllers/promotion.controller');
const validateObjectId = require('../middleware/validateObjectId');

// route เฉพาะ ต้องมาก่อน :id
router.patch('/:id/status', Auth(['employee']), validateObjectId('id'), Promotion.updateStatus);
router.patch('/:id/toggle', Auth(['employee']), validateObjectId('id'), Promotion.toggleStatus);

router.get('/employee', Auth(['employee']), Promotion.get);

router.get('/', Promotion.get);
router.get('/:id', Auth(['employee']), validateObjectId('id'), Promotion.getById);
router.post('/', Auth(['employee']), Promotion.create);
router.patch('/:id', Auth(['employee']), validateObjectId('id'), Promotion.update);
router.delete('/:id', Auth(['employee']), validateObjectId('id'), Promotion.delete);

module.exports = router;