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

});

const validateRoom = (data) => {
    const schema = Joi.object({

        base_price: Joi.number().required(),    
        type: Joi.string(),
        max_person: Joi.number().required(),
        children: Joi.number().required(),
        base_price: Joi.number().required(),    
        room_amount: Joi.number().required(),
    });

    return schema.validate(data);
}

const Room = mongoose.model('Room', room);

module.exports = { Room, validateRoom };