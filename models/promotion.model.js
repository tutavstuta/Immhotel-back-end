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
    condition: {
        type: String
    },
    image: { type: String },
    status: { type: Number, enum: [0, 1], default: 1 } // 1 = เปิด, 0 = ปิด
});

const validatePromotion = (data) => {
    const schema = Joi.object({
        title: Joi.string(),
        description: Joi.string().allow(""),
        discount: Joi.number().min(0),
        condition: Joi.string().allow(""),
        status: Joi.number().valid(0, 1).default(1) // ให้รับ 0/1
    });
    return schema.validate(data);
}

const Promotion = mongoose.model('Promotion', promotion);

module.exports = { Promotion, validatePromotion };