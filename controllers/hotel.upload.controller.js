const multer = require('multer')
const upload = multer({ dest: '../uploads/' }).array('image', 50);
var { HotelImage } = require('../models/hotelimage.model');

module.exports.hotelUpload = (req, res) => {
    try {
        upload(req, res, async function (err) {
            console.log('files %s :', req.files, req.file)
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                return res.status(400).send(err.message);
            } else if (err) {
                // An unknown error occurred when uploading.
                return res.status(400).send(err.message);
            }

            const result = await HotelImage.create(req.files);

            // Everything went fine.
            return res.status(200).send(result);
        })

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.deleteHotelImage = async (req, res) => {

    try {

        const id = req.params.id;
        const image = await HotelImage.findById(id);

        if (!image) {
            return res.status(400).send({ message: 'Image not found' });
        }

        const result = await HotelImage.findByIdAndDelete(id);
        if (result) {

            const fs = require('fs');
            fs.unlink('../uploads/' + image.filename, err => {
                if (err) {
                    console.log(err);
                }
            });

            return res.status(200).send(result._id);
        }else{
            return res.status(400).send({message:"delete image failed"});
        }

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}