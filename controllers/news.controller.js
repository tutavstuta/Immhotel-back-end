const path = require('path');
const multer = require('multer');
const upload = multer({ dest: '../uploads/', fileFilter: fileFilter }).single('image');
const { News, validateNews } = require('../models/news.model');

function fileFilter(req, file, cb) {
    const { error } = validateNews(req.body);
    if (error) {
        console.error({ message: "validate error", error: error.details[0].message });
        return cb(error.details[0].message, false);
    }
    cb(null, true);
}


module.exports.create = async (req, res) => {
    upload(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
            console.error(err);
            return res.status(400).send({ message: err.message });
        } else if (err) {
            console.error(err);
            return res.status(400).send({ message: err.message });
        }
        try {
            console.log('Creating news:', req.body); // log ก่อนสร้าง
            const newsDoc = await News.create({ ...req.body, image: req.file ? req.file.filename : null });
            console.log('Created news:', newsDoc); // log หลังสร้าง
            return res.status(200).send({ message: "create News successfully", data: newsDoc });
        } catch (error) {
            console.error(error);
            return res.status(400).send({ message: error.message });
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

            const { error } = validateNews(req.body);

            if (error) {
                return res.status(400).send({ message: "validate error", error: error.details[0].message });

            }

            const Newsupdate = await News.findByIdAndUpdate(id, { ...req.body, image: req.file ? req.file.filename : null }, { returnDocument: 'after' });

            return res.status(200).send({ message: "update News successfully", data: Newsupdate });


        } catch (error) {

            console.error(error);
            return res.send(error.message);

        }
    });
};

module.exports.get = async (req, res) => {
    try {

        const Newss = await News.find();

        return res.status(200).send({ message: "get News successfully", data: Newss });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.getById = async (req, res) => {
    try {
        const id = req.params.id;
        const newsDoc = await News.findById(id);
        return res.status(200).send({ message: "get News successfully", data: newsDoc });
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.delete = async (req,res) => {
    try {
        const id = req.params.id;
        const newsDoc = await News.findByIdAndDelete(id);
        if(!newsDoc){
            return res.status(400).send({message:"News not found"});
        }
        return res.status(200).send({ message: "delete News successfully", data: newsDoc });
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

