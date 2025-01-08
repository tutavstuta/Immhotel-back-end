var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var customer = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  telephone: {
    type: String,
    required: true
  },
  role:{
    type: String,
    require:true,
    default:'customer'
  }
});

const validateCustomer = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    password: Joi.string(),
    telephone: Joi.string(),
    email: Joi.string()
  });
  return schema.validate(data);
};

const validateEditProfile = (data) => {
  const schema = Joi.object({
      name: Joi.string(),
      password: Joi.string(),
      telephone: Joi.string()
  });

  return schema.validate(data);
};
const validateProfile = (data) => {
  const schema = Joi.object({
      name: Joi.string(),
      password: Joi.string(),
      telephone: Joi.string(),
      email: Joi.string()
  });

  return schema.validate(data);
};

const validateCustomerLogin = (data) => {
  const schema = Joi.object({
    password: Joi.string(),
    email: Joi.string()
  });
  return schema.validate(data);
}

const Customer = mongoose.model('Customer', customer);

module.exports = { Customer, validateCustomer, validateCustomerLogin, validateEditProfile, validateProfile };