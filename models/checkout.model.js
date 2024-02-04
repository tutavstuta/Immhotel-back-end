var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var checkout = new Schema({
    time: {
        type: Date,
        required: true,
        default: new Date()
    },
    checkin: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'checkin'
    }
}, { timestamps: true });

const validateCheckout = (data) => {
    const schema = Joi.object({
        checkin: Joi.string()
    });
    return schema.validate(data);
};

const Checkout = mongoose.model('Checkout', checkout);

module.exports = { Checkout, validateCheckout };