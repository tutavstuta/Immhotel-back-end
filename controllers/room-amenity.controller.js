const multer = require('multer')
const upload = multer({ dest: '../uploads/', fileFilter: fileFilter }).single('image');
var { RoomAmenity } = require('../models/room-amenity.model');

function fileFilter(req, file, cb) {

    cb(null, true)

}

module.exports.create = (req, res) => {
    try {
        upload(req, res, async function (err) {
            console.log('file %s :', req.file)
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).send(err.message);
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(400).send(err.message);
            };

            if (req.file) {

                const roomAmenityData = {
                    name: req.body.name,
                    icon: req.file.filename
                }

                // Everything went fine.
                const result = await RoomAmenity.create(roomAmenityData);
                return res.status(200).send(result);
            } else {
                return res.status(400).send({ message: "icon file is required" })
            }
        })

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.update = async (req, res) => {
    try {
        upload(req, res, async function (err) {
            console.log('file %s :', req.file)
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).send(err.message);
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(400).send(err.message);
            };

            const id = req.params.id;

            const roomAmenity = await RoomAmenity.findById(id);

            if (!roomAmenity) {
                return res.status(400).send({ message: "room amenity is not found" });
            }

            const roomAmenityData = {
                name: req.body.name,
                icon: req.file?.filename ? req.file?.filename : roomAmenity.icon
            }

            // Everything went fine.
            const result = await RoomAmenity.findByIdAndUpdate(id, roomAmenityData);
            return res.status(200).send(result);

        })

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getAll = async (req, res) => {
    try {

        const roomAmenity = await RoomAmenity.find();

        return res.status(200).send({ message: "get room amenity successfully", data: roomAmenity });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req, res) => {
    try {

        const id = req.params.id;

        const roomAmenity = await RoomAmenity.findById(id);

        return res.status(200).send({ message: "get room amenity successfully", data: roomAmenity });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.delete = async (req, res) => {

    try {

        const id = req.params.id;
        const roomAmenity = await RoomAmenity.findById(id);

        if (!roomAmenity) {
            return res.status(400).send({ message: 'room amenity is not found' });
        }

        const result = await RoomAmenity.findByIdAndDelete(id);

        if (result) {
            const fs = require('fs');
            fs.unlink('../uploads/' + roomAmenity.icon, err => {
                if (err) {
                    console.log(err);
                }
            });

            return res.status(200).send({ message: "delete image failed", data: result._id });
        } else {
            return res.status(400).send({ message: "delete image failed" });
        }

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}