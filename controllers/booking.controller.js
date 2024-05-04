const { Booking, validateBooking } = require('../models/booking.model');
const { Room, validateSearch } = require('../models/room.model');

module.exports.search = async (req, res) => {
    try {

        const { error } = validateSearch(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const pipeline = [
            {
                '$match': {
                    '$and': [
                        {
                            '$expr': {
                                '$gte': [
                                    '$max_person', req.body.adult
                                ]
                            }
                        }, {
                            '$expr': {
                                '$gte': [
                                    '$children', req.body.children
                                ]
                            }
                        }
                    ]
                }
            }, {
                '$lookup': {
                    'from': 'bookings',
                    'let': {},
                    'pipeline': [],
                    'as': 'booking_mapping'
                }
            }
        ]

        const avariableBookings = await Room.aggregate(pipeline);

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

        let totalNigths = req.body.totalNigths;
        let pricePerNight = 0;
        let seasonPrice = 0;

        const room = await Room.findById(req.body.roomId);

        if (!room) {
            return res.status(400).send({ message: "room not found" });
        }

        pricePerNight = room.base_price + seasonPrice;

        const bookingData = {
            ref_number: new Date().getTime(),
            num_guess: req.body.numGuess,
            num_children: req.body.numbChildren,
            total_nigths: totalNigths,
            price_per_night: pricePerNight,
            total_price: pricePerNight * totalNigths,
            date_from: req.body.checkIn,
            date_to: req.body.checkOut,
            room: req.body.roomId,
            customer: req.user.user_id
        };

        const booking = await Booking.create(bookingData);

        return res.send(booking);

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}