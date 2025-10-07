var express = require('express');
var router = express.Router();
var Auth = require('../middleware/auth');
var News = require('../controllers/news.controller');


router.get('/',News.get);
router.get('/employee', Auth(['employee']), News.get);
router.get('/:id',Auth(['employee']),News.getById);
router.post('/',Auth(['employee']),News.create);
router.patch('/:id',Auth(['employee']),News.update);
router.delete('/:id',Auth(['employee']),News.delete);



module.exports = router;