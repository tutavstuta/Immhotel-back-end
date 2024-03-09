const multer = require('multer');
const upload = multer({ dest: '../uploads/', fileFilter: fileFilter }).single('image');
const { Promotion, validatePromotion } = require('../models/promotion.model');

function fileFilter(req, file, cb) {

    const { error } = validatePromotion(req.body);

    if (error) {
        console.error({ message: "validate error", error: error.details[0].message });
        cb(error.details[0].message, false);
    }

    cb(null, true)

}

module.exports.create = async (req, res) => {


    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error(err);
            return res.send(err.message)
        } else if (err) {
            // An unknown error occurred when uploading.
            console.error(err);
            return res.send(err.message)
        }

        // Everything went fine.
        try {

            const promotion = await Promotion.create({ ...req.body, image: req.file ? req.file.filename : null });

            return res.status(200).send({ message: "create promotion successfully", data: promotion });

        } catch (error) {

            console.error(error);
            return res.send(error.message);

        }

    });
};

module.exports.update = async (req, res) => {

    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.error(err);
            return res.send(err.message)

        } else if (err) {
            console.error(err);
            return res.send(err.message)
        }

        // Everything went fine.
        try {

            const id = req.params.id;

            const { error } = validatePromotion(req.body);

            if (error) {
                return res.status(400).send({ message: "validate error", error: error.details[0].message });

            }

            const promotion = await Promotion.findByIdAndUpdate(id, { ...req.body, image: req.file ? req.file.filename : null }, { returnDocument: 'after' });

            return res.status(200).send({ message: "update promotion successfully", data: promotion });


        } catch (error) {

            console.error(error);
            return res.send(error.message);

        }
    });
};

module.exports.get = async (req, res) => {
    try {

        const promotions = await Promotion.find();

        return res.status(200).send({ message: "get promotion successfully", data: promotions });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req, res) => {
    try {

        const id = req.params.id;

        const promotion = await Promotion.findById(id);

        return res.status(200).send({ message: "get promotion successfully", data: promotion });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.delete = async (req,res) => {
    try {

        const id = req.params.id;

        const promotion = await Promotion.findByIdAndDelete(id);

        if(!promotion){
            return res.status(400).send({message:"promotion not found"});
        }

        return res.status(200).send({ message: "delete promotion successfully", data: promotion });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

