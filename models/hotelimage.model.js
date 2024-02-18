var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hoteimage = new Schema({
  mimetype: {
    type: String,
    required: true
  },
  filename: {
    type: String,
    required: true
  }
});

const HotelImage = mongoose.model('HotelImage',hoteimage);

module.exports = {HotelImage}