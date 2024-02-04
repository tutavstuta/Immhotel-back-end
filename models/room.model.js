var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var room = new Schema({
    room_number: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    rating: {
        type: Number
    },
    cleaning_rate: {
        type: Number
    },
    image_url: [{
        type: String
    }],
    breakfast: {
        type: Boolean
    },
    bed_type: {
        type: String
    },
    aircondition: {
        type: Boolean
    },
    max_person: {
        type: Number
    },
    children_fee: {
        type: Boolean
    },
    view_type: {
        type: String
    },
    bath_type: {
        type: String
    },
    smoke: {
        type: Boolean
    },
    furniture: {
        type: String
    },
    room_service: {
        type: String
    },
    amenities: {
        type: String
    },
    wifi: {
        type: Boolean
    },
    entertaiment: {
        type: String
    },
    security: {
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    promotions: {
        type: String
    },
    status: {
        type: Boolean
    }
});

const validateRoom = (data) => {
    const schema = Joi.object({
        room_number: Joi.string(),
        type: Joi.string(),
        rating: Joi.number(),
        cleaning_rate: Joi.number(),
        breakfast: Joi.boolean(),
        bed_type: Joi.string(),
        aircondition: Joi.boolean(),
        max_person: Joi.string(),
        children_fee: Joi.boolean(),
        view_type: Joi.string(),
        bath_type: Joi.string(),
        smoke: Joi.string(),
        furniture: Joi.string(),
        room_service: Joi.string(),
        amenities: Joi.string(),
        wifi: Joi.string(),
        entertaiment: Joi.string(),
        security: Joi.string(),
        price: Joi.number(),
        promotions: Joi.string(),
        status: Joi.string(),
    });

    return schema.validate(data);
}

const Room = mongoose.model('Room', room);

module.exports = { Room, validateRoom };