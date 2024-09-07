var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var room = new Schema({
  type: {
    type: String,
    required: true
  },
  max_person: {
    type: Number
  },
  children: {
    type: Number
  },
  base_price: {
    type: Number,
    required: true
  },
  status: {
    type: Boolean
  },
  room_amount: {
    type: Number,
    required: true
  },
  image: {
    type: String
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['เปิดจอง', 'ปิดจองชั่วคราว', 'ยกเลิก'],
    default: "เปิดจอง"
  },
  amenity: [{
    type: String
  }],
  overview: [{
    type: String
  }]

});

const validateRoom = (data) => {
  const schema = Joi.object({

    base_price: Joi.number(),
    type: Joi.string(),
    max_person: Joi.number(),
    children: Joi.number(),
    base_price: Joi.number(),
    room_amount: Joi.number(),
    description: Joi.string(),
    overview: Joi.array().items(Joi.string()),
    amenity: Joi.array().items(Joi.string()),

  });

  return schema.validate(data);
}

const validateSearch = (data) => {
  const schema = Joi.object({
    roomId:Joi.string().required(),
    adult: Joi.number(),
    children: Joi.number(),
    checkIn: Joi.date(),
    checkOut: Joi.date()
  });
  return schema.validate(data);
}

const Room = mongoose.model('Room', room);

module.exports = { Room, validateRoom, validateSearch };