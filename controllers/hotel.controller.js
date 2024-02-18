const { Hotel, validateHotel } = require('../models/hotel.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../lib/jwthelper')

module.exports.create = async (req, res) => {
    try {

        const { error } = validateHotel(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const isExist = await Hotel.findOne({name:req.body.name});

        if(isExist){
            return res.status(200).send({ message:"hotel name already exists"})
        }

        const hotel = await Hotel.create({...req.body});

        return res.status(200).send({ message: "hotel created", hotel: hotel });

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
            }
        ];

        const hotel = await Hotel.aggregate(pipeline);

        return res.status(200).send({ message: "get all hotel successfully", data: hotel });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.update = async (req, res) => {
    try {

        const { error } = validateHotel(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const id = req.params.id;

        const hotel = await Hotel.findById(id);

        if(!hotel){
            return res.status(404).send({ message: "hotel not found"})
        }     

        const result = await Hotel.findByIdAndUpdate(id, {...req.body}, { returnDocument: 'after' });

        return res.status(200).send({ message: "update hotel successfully", data: result._id });


    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.delete = async (req, res) => {
    try {

        const id = req.params.id;

        const result = await Hotel.findByIdAndDelete(id);

        return res.status(200).send({ message: "delete successfully", data: result._id });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req,res) => {
    try {

        const pipeline = [
            {
              '$lookup': {
                'from': 'hotelimages', 
                'let': {}, 
                'pipeline': [], 
                'as': 'image'
              }
            }
          ]
        const hotel = await Hotel.aggregate(pipeline);

        return res.status(200).send({message:"get hotel successfully",data:hotel[0] });
        
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

