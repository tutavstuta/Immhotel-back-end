var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Joi = require('joi');

// กำหนดชื่อ schema เป็น customerSchema และใช้ชื่อนี้ต่อไป
const customerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  name: { type: String },
  telephone: { type: String },
  role: { type: String, default: 'customer' }
}, { timestamps: true });

// ซ่อนฟิลด์ที่ไม่ควรส่งกลับ และลบ __v
customerSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  }
});

// (ถ้ามี) เพิ่ม validate ด้วย Joi — ปรับให้ตรงกับของคุณ
const validateCustomer = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().allow('', null),
    telephone: Joi.string().allow('', null),
    role: Joi.string().valid('customer','employee','admin').default('customer')
  });
  return schema.validate(data);
};

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer, validateCustomer };