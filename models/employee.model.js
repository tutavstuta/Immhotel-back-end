var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var employee = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    position: {
        type: String
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role:{
        type: String,
        required: true
    }
});

const validateEmployee = (data) => {

    const schema = Joi.object({
        first_name: Joi.string(),
        last_name: Joi.string().allow(""),
        username: Joi.string(),
        password: Joi.string(),
    });
    return schema.validate(data);
};

const validateLogin = (data) => {
    const schema = Joi.object({
        username: Joi.string(),
        password: Joi.string(),
    });
    return schema.validate(data);
}

const validateUpdateEmployee = (data) => {
    const schema = Joi.object({
        first_name: Joi.string().allow(""),
        last_name: Joi.string().allow(""),
    });
    return schema.validate(data);
}

const Employee = mongoose.model('Employee', employee);

module.exports = { Employee, validateEmployee, validateLogin,validateUpdateEmployee };