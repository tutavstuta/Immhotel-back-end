var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var roomOverview = new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },

});

const validateRoomOverview = (data) => {
    const schema = Joi.object({

        name: Joi.string().required(),    
        icon: Joi.string().required()

    });

    return schema.validate(data);
}

const RoomOverview = mongoose.model('RoomOverview', roomOverview);

module.exports = { RoomOverview, validateRoomOverview };