const multer = require('multer');
const path = require('path');
const { imageUpload } = require('../utils/upload');
const upload = imageUpload.single('image');
const { Promotion, validatePromotion } = require('../models/promotion.model');

function fileFilter(req, file, cb) {
    const { error } = validatePromotion(req.body);
    if (error) {
        console.error({ message: "validate error", error: error.details[0].message });
        return cb(error.details[0].message, false); // ต้อง return
    }
    cb(null, true);
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
        return res.status(200).json({ message: "get promotion successfully", data: promotions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'internal error' });
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
};

module.exports.updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const n = Number(req.body.status);
        if (![0, 1].includes(n)) {
            return res.status(400).send({ message: "invalid status, must be 0 or 1" });
        }
        const promotion = await Promotion.findByIdAndUpdate(
            id,
            { $set: { status: n } },
            { new: true }
        );
        if (!promotion) return res.status(404).send({ message: "promotion not found" });

        return res.status(200).send({ message: "update promotion status successfully", data: promotion });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};

module.exports.toggleStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const updated = await Promotion.findByIdAndUpdate(
            id,
            [
                { $set: { status: { $cond: [{ $eq: ['$status', 1] }, 0, 1] } } }
            ],
            { new: true }
        );
        if (!updated) return res.status(404).send({ message: "promotion not found" });
        return res.status(200).send({ message: "toggle promotion status successfully", data: updated });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message });
    }
};

