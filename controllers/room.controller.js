const { Room, validateRoom } = require('../models/room.model');
const multer = require('multer')
const upload = multer({ dest: '../uploads/' }).array('image', 50);

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
                $match:{}
            }
        ]
        const room = await Room.aggregate(pipeline);

        return res.status(200).send({ message: "get room successfully", data: room });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req,res) => {
    try {

        const id = req.params.id;

        const pipeline = [
            {
                $match:{
                    $expr:{
                        $eq:[{$toString:"$_id"},id]
                    }
                }
            }
        ]

        const room = await Room.aggregate(pipeline);

        return res.status(200).send({message:"get room  successfully",data:room[0]});
        
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

        return res.status(200).send({message:"delete room successfully",data:result._id});
        
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}