const { Room, validateRoom } = require('../models/room.model');
const multer = require('multer')
const uploadsingle = multer({ dest: '../uploads/' }).single('image');
const fs = require('fs');

module.exports.create = async (req, res) => {
    try {

        const { error } = validateRoom(req.body);
        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const isExist = await Room.findOne({ type: req.body.type });

        if (isExist) {
            return res.status(200).send({ message: "hotel name already exists" })
        };

        const room = await Room.create(req.body);

        return res.status(200).send({ message: "Room created successfully", data: room._id });


    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getAll = async (req, res) => {
    try {

        const pipeline = [
            {
                '$match': {}
            }
        ]
        const room = await Room.aggregate(pipeline);

        return res.status(200).send({ message: "get room successfully", data: room });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req, res) => {
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
            }, {
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

        return res.status(200).send({ message: "get room  successfully", data: room[0] });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.update = async (req, res) => {
    try {

        const id = req.params.id;

        const { error } = validateRoom(req.body);
        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const room = await Room.findById(id);

        if (!room) {
            return res.status(400).send({ message: "room not found" })
        }


        const result = await Room.findByIdAndUpdate(id, req.body);

        return res.status(200).send({ message: "update room successfully", data: result._id });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.delete = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await Room.findByIdAndDelete(id);

        return res.status(200).send({ message: "delete room successfully", data: result._id });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.uploadCoverImage = async (req, res) => {

    uploadsingle(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send({ message: 'multer error', error: err.message });
        } else if (err) {
            return res.status(400).send({ message: 'upload error', error: err.message });
        };

        const id = req.params.id;
        console.log('id', id);

        if (!id || id == "") {
            fs.unlink('../uploads/' + req.file.filename, error => {

                console.error(error.message);
            })
            return res.status(403).send({ message: "id is required" })
        }

        try {

            const room = await Room.findById(id);

            fs.unlink('../uploads/' + room.image, err => {
                if (err) console.error(err);
                console.log(room.image + ' was deleted');
            });


            const result = await Room.findByIdAndUpdate(id, { image: req.file.filename });

            if (result) {

                return res.status(200).send({ message: 'upload image successfully', data: result._id });

            } else {
                return res.status(400).send({ message: "upload image failed" });
            }

        } catch (error) {
            return res.send(error.message)
        }
    });

}