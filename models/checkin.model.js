var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var checkin = new Schema({
    time: {
        type: Date,
        required: true,
        default: new Date()
    },
    room_id: {
        type: String,
        required: true
    },
    booking: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'booking'
    }
}, { timestamps: true });

const validateCheckin = (data) => {
    const schema = Joi.object({
        room_id: Joi.string(),
        booking: Joi.string(),
    });

    return schema.validate(data);
};

const Checkin = mongoose.model('Checkin', checkin);

module.exports = { Checkin, validateCheckin };