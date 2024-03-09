var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var promotion = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    discount: {
        type: Number
    },
    condition: [{
        type: String
    }],
    image: {
        type: String
    }
});

const validatePromotion = (data) => {
    const schema = Joi.object({
        title: Joi.string(),
        description: Joi.string().allow(""),
        discount: Joi.number().min(0),
        condition: Joi.array().items(Joi.string().allow(""))
    });
    return schema.validate(data);
}

const Promotion = mongoose.model('Promotion', promotion);

module.exports = { Promotion, validatePromotion };