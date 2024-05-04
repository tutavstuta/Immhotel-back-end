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
        required: true,
        default:false
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
        "numGuess": Joi.number().required(),
        "numbChildren": Joi.number().required(),
        "totalNigths": Joi.number().required(),
        "checkIn": Joi.date().required(),
        "checkOut": Joi.date().required(),
        "roomId": Joi.string().required()
    });
    return schema.validate(data);
}

const Booking = mongoose.model('Booking', booking);

module.exports = { Booking, validateBooking }