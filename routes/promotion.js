var express = require('express');
var router = express.Router();
var Auth = require('../middleware/auth');
var Promotion = require('../controllers/promotion.controller');


router.get('/',Promotion.get);
router.get('/employee', Auth(['employee']), Promotion.get);
router.get('/:id',Auth(['employee']),Promotion.getById);
router.post('/',Auth(['employee']),Promotion.create);
router.patch('/:id',Auth(['employee']),Promotion.update);
router.delete('/:id',Auth(['employee']),Promotion.delete);



module.exports = router;