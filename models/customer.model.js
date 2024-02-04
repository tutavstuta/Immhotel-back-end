var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var customer = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    tel: {
        type: String,
        required: true
    },
    email_address: {
        type: String,
        required: true
    }
});

const validateCustomer = (data) => {
    const schema = Joi.object({
        name:Joi.string(),
        password: Joi.string(),
        tel: Joi.string(),
        email_address: Joi.string()
    });
    return schema.validate(data);
};

const Customer = mongoose.model('Customer', customer);

module.exports = { Customer, validateCustomer };