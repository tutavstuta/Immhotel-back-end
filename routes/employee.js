var express = require('express');
var router = express.Router();
var Employee = require('../controllers/employee.controller');
var Auth = require('../middleware/auth')

router.get('/',Auth(['employee']),Employee.getAll);
router.get('/me',Auth(['employee']),Employee.me);
router.get('/:id',Auth(['employee']),Employee.getById);
router.post('/login',Employee.login);
router.post('/create',Auth(['employee']),Employee.create);
router.patch('/:id',Auth(['employee']),Employee.update);
router.delete('/:id',Auth(['employee']),Employee.delete);

module.exports = router