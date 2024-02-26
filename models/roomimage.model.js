var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var roomImage = new Schema({
    room:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'room'
    },
    mimetype: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
});

const RoomImage = mongoose.model('RoomImage', roomImage);

module.exports = { RoomImage };