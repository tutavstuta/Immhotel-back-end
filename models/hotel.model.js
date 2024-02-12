var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var hotel = new Schema({
    name: {
        type: String,
        required: true
    },
    phone_number: [{
        type: String
    }],
    description: {
        type: String
    },
    address: {
        type: String
    },
    tumbon: {
        type: String
    },
    amphure: {
        type: String
    },
    province: {
        type: String
    },
    country: {
        type: String
    },
    image_url: [{
        type: String
    }],
    amenities: {
        type: String
    },
    highlight: {
        type: String
    },
    special_service: {
        type: String
    },
    nearly_place: {
        type: String
    },
    parking: {
        type: String
    },
    property_policies: {
        type: String
    },
    certificate: {
        type: String
    },
    other_information: {
        type: String
    }
});

const validateHotel = (data) => {

    const schema = Joi.object({
        name: Joi.string(),
        phone_number: Joi.array(),
        description: Joi.string().allow(""),
        address: Joi.string().allow(""),
        tumbon: Joi.string().allow(""),
        amphure: Joi.string().allow(""),
        province: Joi.string().allow(""),
        country: Joi.string().allow(""),
        amenities: Joi.string().allow(""),
        highlight: Joi.string().allow(""),
        special_service: Joi.string().allow(""),
        nearly_place: Joi.string().allow(""),
        parking: Joi.string().allow(""),
        property_policies: Joi.string().allow(""),
        certificate: Joi.string().allow(""),
        other_information: Joi.string().allow(""),
    });
    
    return schema.validate(data);
    
}

const Hotel = mongoose.model('Hotel', hotel);

module.exports = { Hotel,validateHotel };