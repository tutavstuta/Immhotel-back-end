const multer = require('multer')
const upload = multer({ dest: '../uploads/', fileFilter: fileFilter }).array('image', 50);
var { RoomImage} = require('../models/roomimage.model');

function fileFilter(req, file, cb) {

    cb(null, true)

}

// อัปโหลดรูปหน้าปกและอัปเดต field image ใน Room
module.exports.uploadRoomCover = (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).send(err.message);
        } else if (err) {
            return res.status(400).send(err.message);
        }

        // อัปเดต field image ใน Room
        const roomId = req.params.room;
        const filename = req.file.filename;

        const result = await Room.findByIdAndUpdate(roomId, { image: filename }, { new: true });

        if (result) {
            return res.status(200).send({ message: "success", data: result });
        } else {
            return res.status(400).send({ message: "update cover failed" });
        }
    });
};
module.exports.uploadRoomImage = (req, res) => {
    try {
        upload(req, res, async function (err) {
            console.log('files %s :', req.files)
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).send(err.message);
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(400).send(err.message);
            };

            const roomImage = req.files.map(el => ({ ...el, room: req.params.room }));

            const result = await RoomImage.create(roomImage);

            // Everything went fine.
            return res.status(200).send(result);
        })

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.deleteRoomImage = async (req, res) => {

    try {

        const id = req.params.id;
        const image = await RoomImage.findById(id);

        if (!image) {
            return res.status(400).send({ message: 'Image not found' });
        }

        const result = await RoomImage.findByIdAndDelete(id);
        if (result) {

            const fs = require('fs');
            fs.unlink('../uploads/' + image.filename, err => {
                if (err) {
                    console.log(err);
                }
            });

            return res.status(200).send({ message: "delete image failed",data:result._id });
        } else {
            return res.status(400).send({ message: "delete image failed" });
        }

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}