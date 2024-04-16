var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var roomAmenity = new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },

});

const validateRoomAmenity = (data) => {
    const schema = Joi.object({

        name: Joi.string().required(),    
        icon: Joi.string().required()

    });

    return schema.validate(data);
}

const RoomAmenity = mongoose.model('RoomAmenity', roomAmenity);

module.exports = { RoomAmenity, validateRoomAmenity };