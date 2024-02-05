const { Employee, validateEmployee } = require('../models/employee.model');

module.exports.create = async (req, res) => {
    try {

        const { error } = validateEmployee(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const employee = await Employee.create({ ...req.body, role: 'employee' });

        return res.status(200).send({ message: "employee created", employee: employee });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.me = async (req, res) => {
    try {

        return res.send(req.user);

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

        const employee = await Employee.aggregate(pipeline);

        return res.status(200).send({ message: "get all employee successfully", data: employee });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

module.exports.update = async (req, res) => {
    try {

        const { error } = validateEmployee(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const id = req.params.id;

        const result = await Employee.findByIdAndUpdate(id, { ...req.body }, { returnDocument: 'after' });

        return res.status(200).send({ message: "update empoyee successfully", data: result._id });


    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.delete = async (req, res) => {
    try {

        const id = req.params.id;

        const result = await Employee.findByIdAndDelete(id);

        return res.status(200).send({ message: "delete successfully", data: result._id });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}

