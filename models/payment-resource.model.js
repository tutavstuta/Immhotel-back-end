var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

var payment_resource = new Schema({
    type: {
        type: String,
        required: true
    },
    holder_name: {
        type: String,
        required: true
    },
    bank_name: {
        type: String,
        required: true
    },
    book_bank_number: {
        type: String,
        required: true
    },
    qr_code: {
        type: String // qr code image url
    }
});

const validatePaymentResource = (data) => {
    const schema = Joi.object({
        type: Joi.string(),
        holder_name: Joi.string(),
        bank_name: Joi.string(),
        book_bank_number: Joi.string()
    });
    return schema.validate(data);
};

const PaymentResource = mongoose.model('PaymentResource', payment_resource);

module.exports = { PaymentResource, validatePaymentResource };


