const { Booking, validateBooking } = require('../models/booking.model');
const { Room, validateSearch } = require('../models/room.model');

module.exports.search = async (req, res) => {
    try {

        const { error } = validateSearch(req.body);

        if (error) {
            console.error(error);
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const avariableBookings = await searchRoom(req.body);

        return res.send(avariableBookings)

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.create = async (req, res) => {
    try {

        const { error } = validateBooking(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        }

        const room = await searchRoom(req.body);

        if (!room[0]) {
            return res.status(400).send({ message: "invalid room data" });
        };

        const selectPromotion = room[0].promotions.find(el => {
            el._id == req.body.promotionId;
            return el;
        });

        const bookingData = {
            ref_number: new Date().getTime(),
            num_guess: req.body.adult,
            num_children: req.body.children,
            total_nigths: room[0].total_night,
            price_per_night: selectPromotion.total_price,
            total_price: selectPromotion.total_price * room[0].total_night,
            date_from: req.body.checkIn,
            date_to: req.body.checkOut,
            room: room[0].type,
            customer: req.user.user_id,
            promotion: selectPromotion
        };

        const booking = await Booking.create(bookingData);

        return res.send({ bookingId: booking._id });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getAll = async (req, res) => {
    try {

        const pipeline = [
            {
                $match: {}
            },
            {
                $lookup: {
                    from: "customers",
                    localField: "customer",
                    foreignField: "_id",
                    as: "customer_mapping"
                }
            },
            {
                $set: {
                    customer_name: { $first: "$customer_mapping.name" },
                    customer_tel: { $first: "$customer_mapping.tel" },
                    customer_email: { $first: "$customer_mapping.email" },
                }
            },
            {
                $unset: "customer_mapping"
            }
        ];

        const bookings = await Booking.aggregate(pipeline);

        return res.status(200).send(bookings)

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req, res) => {
    try {

        const bookingId = req.params.bookingId;

        const booking = await Booking.findById(bookingId);

        if (booking) {
            return res.status(200).send({ message: 'ok', data: booking })
        } else {
            return res.status(400).send({ message: "booking not found", error: "invalid booking id" })
        }

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.getByCustomerId = async (req, res) => {
    try {

        const id = req.user.user_id;

        const bookings = await Booking.find({ customer: id });

        return res.status(200).send(bookings)

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getOnRange = async (req, res) => {

    try {

        const { start, end } = req.body;
        console.log(start, end)

        const pipeline = [
            {
                '$set': {
                    'date_from': {
                        '$first': {
                            '$split': [
                                '$date_from', 'T'
                            ]
                        }
                    },
                    'date_to': {
                        '$first': {
                            '$split': [
                                '$date_to', 'T'
                            ]
                        }
                    }
                }
            },
            {
                '$match': {
                    '$or': [
                        {
                            '$and': [
                                {
                                    '$expr': {
                                        '$gte': [
                                            { $toDate: '$date_from' }, {
                                                '$toDate': start
                                            }
                                        ]
                                    }
                                }, {
                                    '$expr': {
                                        '$lte': [
                                            { $toDate: '$date_from' }, {
                                                '$toDate': end
                                            }
                                        ]
                                    }
                                }
                            ]
                        }, {
                            '$and': [
                                {
                                    '$expr': {
                                        '$gte': [
                                            { $toDate: '$date_to' }, {
                                                '$toDate': start
                                            }
                                        ]
                                    }
                                }, {
                                    '$expr': {
                                        '$lte': [
                                            { $toDate: '$date_to' }, {
                                                '$toDate': end
                                            }
                                        ]
                                    }
                                }
                            ]
                        }, {
                            '$and': [
                                {
                                    '$expr': {
                                        '$lte': [
                                            { $toDate: '$date_from' }, {
                                                '$toDate': start
                                            }
                                        ]
                                    }
                                }, {
                                    '$expr': {
                                        '$gte': [
                                            { $toDate: '$date_to' }, {
                                                '$toDate': end
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            }
        ];

        const bookings = await Booking.aggregate(pipeline)

        return res.status(200).send({ message: 'ok', data: bookings });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}


async function searchRoom(data) {

    const pipeline = [
        {
            '$set': {
                'date_checkin': data.checkIn,
                'date_checkout': data.checkOut,
                'adults': data.adult,
                'childs': data.children
            }
        }, {
            '$set': {
                'total_night': {
                    '$dateDiff': {
                        'startDate': {
                            '$toDate': '$date_checkin'
                        },
                        'endDate': {
                            '$toDate': '$date_checkout'
                        },
                        'unit': 'day'
                    }
                }
            }
        }, {
            '$match': {
                '$and': [
                    {
                        '$expr': {
                            '$eq': [
                                {
                                    '$toString': '$_id'
                                }, data.roomId
                            ]
                        }
                    }, {
                        '$expr': {
                            '$gte': [
                                '$max_person', data.adult
                            ]
                        }
                    }, {
                        '$expr': {
                            '$gte': [
                                '$children', data.children
                            ]
                        }
                    }
                ]
            }
        }, {
            '$lookup': {
                'from': 'bookings',
                'let': {
                    'start': {
                        '$toDate': '$date_checkin'
                    },
                    'end': {
                        '$toDate': '$date_checkout'
                    }
                },
                'pipeline': [
                    {
                        '$match': {
                            '$and': [
                                {
                                    'suspense': false
                                }, {
                                    '$expr': {
                                        '$gte': [
                                            {
                                                '$toDate': '$date_from'
                                            }, '$$start'
                                        ]
                                    }
                                }, {
                                    '$expr': {
                                        '$lte': [
                                            {
                                                '$toDate': '$date_to'
                                            }, '$$end'
                                        ]
                                    }
                                }
                            ]
                        }
                    }
                ],
                'as': 'booking_mapping'
            }
        }, {
            '$set': {
                'status': {
                    '$cond': {
                        'if': {
                            '$gte': [
                                '$room_amount', {
                                    '$size': '$booking_mapping'
                                }
                            ]
                        },
                        'then': true,
                        'else': false
                    }
                }
            }
        }, {
            '$set': {
                'avaiable': {
                    '$cond': {
                        'if': '$status',
                        'then': {
                            '$subtract': [
                                '$room_amount', {
                                    '$size': '$booking_mapping'
                                }
                            ]
                        },
                        'else': 0
                    }
                },
                'booked': {
                    '$cond': {
                        'if': {
                            '$gt': [
                                {
                                    '$size': '$booking_mapping'
                                }, 0
                            ]
                        },
                        'then': {
                            '$size': '$booking_mapping'
                        },
                        'else': 0
                    }
                }
            }
        }, {
            '$unset': 'booking_mapping'
        }, {
            '$lookup': {
                'from': 'promotions',
                'let': {
                    'base_price': '$base_price'
                },
                'pipeline': [
                    {
                        '$set': {
                            'price': '$$base_price',
                            'total_price': {
                                '$subtract': [
                                    '$$base_price', {
                                        '$multiply': [
                                            '$$base_price', {
                                                '$multiply': [
                                                    '$discount', 0.01
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    }
                ],
                'as': 'promotions'
            }
        }
    ]

    return await Room.aggregate(pipeline);

};

module.exports.getByRefNumber = async (req, res) => {
    try {

        const { refnumber } = req.params;

        const booking = await Booking.findOne({ ref_number: refnumber });

        if (!booking) {
            return res.status(200).send({ message: 'ok', data: {} })
        }

        return res.status(200).send({ message: 'ok', data: booking })

    } catch (error) {
        console.error('get booking by refnumber error ', error);
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}



module.exports.sendSlip = async (req, res) => {
    try {

        const id = req.body.bookingId;

        if (req.file) {
            console.log(req.file);
            const result = await Booking.findByIdAndUpdate(id, { slip: req.file.path }, { new: true });

            if (result) {
                console.log(result);
                return res.status(200).send({ message: 'ok', data: result._id });
            }
        }

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

