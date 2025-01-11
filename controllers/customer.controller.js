const { Customer, validateCustomer, validateCustomerLogin } = require('../models/customer.model');
const { Room } = require('../models/room.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../lib/jwthelper');

module.exports.getAll = async (req,res) => {
    try {

        const page = Number(req.query.page) -1;
        const limit = Number(req.query.limit);

        const customers = await Customer.find({},{password:0}).skip(page*limit).limit(limit);

        return res.status(200).send({message:'ok',data:customers});
        
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}


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
        const { error } = validateCustomerLogin(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const customer = await Customer.findOne({ username: req.body.username });

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

        return res.status(200).send({message:"get room successfully",data:rooms});
        
    } catch (error) {
        console.error(error);
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

