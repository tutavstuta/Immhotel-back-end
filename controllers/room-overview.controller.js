const multer = require('multer')
const upload = multer({ dest: '../uploads/', fileFilter: fileFilter }).single('image');
var { RoomOverview } = require('../models/room-overview.model');

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

                const roomOverviewData = {
                    name: req.body.name,
                    icon: req.file.filename
                }

                // Everything went fine.
                const result = await RoomOverview.create(roomOverviewData);
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

            const roomOverview = await RoomOverview.findById(id);

            if (!roomOverview) {
                return res.status(400).send({ message: "room overview is not found" });
            }

            const roomOverviewData = {
                name: req.body.name,
                icon: req.file?.filename ? req.file?.filename : roomOverview.icon
            }

            // Everything went fine.
            const result = await RoomOverview.findByIdAndUpdate(id, roomOverviewData);
            return res.status(200).send(result);

        })

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getAll = async (req, res) => {
    try {

        const roomOverview = await RoomOverview.find();

        return res.status(200).send({ message: "get room overview successfully", data: roomOverview });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req, res) => {
    try {

        const id = req.params.id;

        const roomOverview = await RoomOverview.findById(id);

        return res.status(200).send({ message: "get room overview successfully", data: roomOverview });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.delete = async (req, res) => {

    try {

        const id = req.params.id;
        const roomOverview = await RoomOverview.findById(id);

        if (!roomOverview) {
            return res.status(400).send({ message: 'room overview is not found' });
        }

        const result = await RoomOverview.findByIdAndDelete(id);

        if (result) {
            const fs = require('fs');
            fs.unlink('../uploads/' + roomOverview.icon, err => {
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