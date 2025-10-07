var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var news = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
});

const validateNews = (data) => {
    const schema = Joi.object({
        title: Joi.string(),
        description: Joi.string().allow(""),
    });
    return schema.validate(data);
}

const News = mongoose.model('News', news);

module.exports = { News, validateNews };