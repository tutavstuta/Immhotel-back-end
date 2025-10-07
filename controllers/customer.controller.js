const { Customer, validateCustomer, validateCustomerLogin, validateEditProfile, validateProfile } = require('../models/customer.model');
const { Room } = require('../models/room.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../lib/jwthelper');
const { response } = require('express');
const { verifyToken } = require('../middleware/auth');

module.exports.getAll = async (req,res) => {
    try {

        const customer = await Customer.find();

        return res.status(200).send({message:"get customer successfully",data:customer})
        
    } catch (error) {

        console.error(error);
        return res.status(500).send({ message: error.message });
        
    }
}

module.exports.profile = async (req, res) => {
    try {
        const userId = req.user.user_id;  // ใช้ user_id จาก decoded token
        console.log("Customer ID:", userId);

        // ดึงข้อมูลโปรไฟล์จากฐานข้อมูลตาม user_id
        const profile = await Customer.findById(userId, { base_price: 0, __v: 0 });

        if (!profile) {
            return res.status(404).send({ message: 'Profile not found' });
        }

        return res.status(200).send({
            message: "get profile successfully",
            data: profile
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};

module.exports.editprofile = async (req, res) => {
    try {
        // ดึง ID และข้อมูลที่ต้องการอัปเดต
        const userId = req.user.user_id;  // ใช้ user_id จาก decoded token
        console.log("Customer ID:", userId);

        // ตรวจสอบว่ามีการส่งข้อมูลใหม่มาใน request หรือไม่
        const updatedData = req.body;

        // ตรวจสอบว่า userId มีค่าอยู่ใน token หรือไม่
        if (!userId) {
            return res.status(401).send({ message: 'User ID not found in token' });
        }

        // ตรวจสอบว่าผู้ใช้งานมีอยู่ในระบบหรือไม่
        const existingCustomer = await Customer.findById(userId);
        if (!existingCustomer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        // ตรวจสอบ Validation ข้อมูลที่ส่งมา
        const { error } = validateEditProfile(updatedData);
        if (error) {
            return res.status(400).send({
                message: "Validation error",
                error: error.details[0].message
            });
        }

        // Hash password ใหม่หากมีการส่ง password มา
        if (updatedData.password) {
            updatedData.password = bcrypt.hashSync(updatedData.password, 10);
        }

        // อัปเดตข้อมูลผู้ใช้
        const updatedCustomer = await Customer.findByIdAndUpdate(
            userId,  // ใช้ userId แทน id
            { $set: updatedData },
            { new: true, runValidators: true }
        );

        if (!updatedCustomer) {
            return res.status(404).send({ message: "Customer not found" });
        }

        // ส่งข้อมูลกลับไปให้ client
        return res.status(200).send({
            message: "Profile updated successfully",
            data: {
                customer_id: updatedCustomer._id,
                name: updatedCustomer.name,
                email: updatedCustomer.email,
                telephone: updatedCustomer.telephone
            }
        });

    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).send({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports.signup = async (req, res) => {
    try {

        const { error } = validateCustomer(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const isExistEmail = await Customer.findOne({ email: req.body.email });

        if (isExistEmail) {
            return res.status(200).send({ message: "username already exists" });
        }

        const password = bcrypt.hashSync(req.body.password, 10);

        const customerData = {
            name: req.body.name,
            password: password,
            telephone: req.body.telephone,
            email: req.body.email,
            role: 'customer'
        }

        const customer = await Customer.create(customerData);

        return res.status(200).send({ message: "signup successfully", data: { customer_id: customer._id } });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password, googleLogin, name } = req.body;

        // ตรวจสอบว่าเป็น Google Login หรือไม่
        if (googleLogin === true) {
            console.log('Google Login detected for email:', email);
            
            // สำหรับ Google Login ไม่ต้องเช็ค password
            const customer = await Customer.findOne({ email: email });
            
            if (customer) {
                // พบผู้ใช้ สร้าง token ให้เลย
                const payload = {
                    user_id: customer._id,
                    name: customer.name,
                    role: customer.role
                };

                const token = generateToken(payload);
                
                console.log('Google Login successful for:', email);
                
                return res.status(200).json({
                    message: 'Google login successful',
                    token: token,
                    tokenType: "Bearer"
                });
            } else {
                console.log('Google user not found:', email);
                return res.status(404).json({
                    message: 'User not found. Please register with Google first.'
                });
            }
        }

        // Login แบบปกติ (โค้ดเดิม)
        const { error } = validateCustomerLogin(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const customer = await Customer.findOne({ email: req.body.email });

        if (!customer) {
            return res.status(404).send({ message: "customer not found" });
        };

        const isValidPassword = bcrypt.compareSync(req.body.password, customer.password);

        if (!isValidPassword) {
            return res.status(400).send({ message: "invalid password" })
        } else {

            const payload = {
                user_id: customer._id,
                name: customer.first_name,
                role: customer.role
            };

            const token = generateToken(payload);

            return res.status(200).send({ message: "login successful", token: token, tokenType: "Bearer" });
        }
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getMe = async (req, res) => {

    try {

        const me = req.user;

        return res.status(200).send({ message: "get me successfully",data:me });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.roomlist = async (req,res) => {
    try {

        const rooms = await Room.find({},{base_price:0,__v:0});

        return res.status(200).send({message:"Get room successfully",data:rooms});
        
    } catch (error) {
        console.error("Error in roomlist:",error);
        return res.send(error.message);
    }
};

module.exports.roomDetail = async (req,res) => {
    try {

        const id = req.params.id;

        const pipeline = [
            {
                '$match': {
                    '$expr': {
                        '$eq': [
                            {
                                '$toString': '$_id'
                            }, id
                        ]
                    }
                }
            },{
                '$project':{
                    'base_price':0,
                    '__v':0
                }
            } ,{
                '$lookup': {
                    'from': 'roomimages',
                    'let': {
                        'room': '$_id'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$eq': [
                                        '$room', '$$room'
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'image_mapping'
                }
            }, {
                '$set': {
                    'overview': {
                        '$cond': {
                            'if': '$overview',
                            'then': '$overview',
                            'else': []
                        }
                    },
                    'amenity': {
                        '$cond': {
                            'if': '$amenity',
                            'then': '$amenity',
                            'else': []
                        }
                    }
                }
            }, {
                '$lookup': {
                    'from': 'roomoverviews',
                    'let': {
                        'overview': '$overview'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$in': [
                                        {
                                            '$toString': '$_id'
                                        }, '$$overview'
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'overview_mapping'
                }
            }, {
                '$lookup': {
                    'from': 'roomamenities',
                    'let': {
                        'amenity': '$amenity'
                    },
                    'pipeline': [
                        {
                            '$match': {
                                '$expr': {
                                    '$in': [
                                        {
                                            '$toString': '$_id'
                                        }, '$$amenity'
                                    ]
                                }
                            }
                        }
                    ],
                    'as': 'amenity_mapping'
                }
            }, {
                '$unset': [
                    'overview', 'amenity'
                ]
            }
        ]

        const room = await Room.aggregate(pipeline);

        return res.status(200).send({message:"get room successfully",data:room[0]});
        
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

