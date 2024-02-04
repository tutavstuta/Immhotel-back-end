var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var booking = new Schema({
    ref_number: {
        type: String,
        required: true
    },
    num_guess: {
        type: Number,
        required: true
    },
    num_children: {
        type: Number,
        required: true
    },
    total_nigths: {
        type: Number,
        required: true
    },
    price_per_night: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    },
    date_from: {
        type: String,
        required: true
    },
    date_to: {
        type: String,
        required: true
    },
    suspense: {
        type: Boolean,
        required: true
    },
    room: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'room'
    },
    customer: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'customer'
    }
});

const validateBooking = (data) => {
    const schema = Joi.object({
        num_guess:Joi.number(),
        num_children:Joi.number(),
        total_nigths:Joi.number(),
        price_per_night:Joi.number(),
        total_price:Joi.number(),
        date_from:Joi.string(),
        date_to:Joi.string(),
        suspense:Joi.boolean(),
        room:Joi.string(),
        customer:Joi.string(),
    });
    return schema.validate(data);
}

const Booking = mongoose.model('Booking', booking);

module.exports = { Booking, validateBooking }