const { Employee, validateEmployee, validateLogin } = require('../models/employee.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../lib/jwthelper')

module.exports.create = async (req, res) => {
    try {

        const { error } = validateEmployee(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const password = bcrypt.hashSync(req.body.password,10);

        const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            username: req.body.username,
            password: password,
            role: 'employee'
        }

        const employee = await Employee.create(data);

        return res.status(200).send({ message: "employee created", employee: employee });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.login = async (req, res) => {
    try {

        const { error } = validateLogin(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const employee = await Employee.findOne({ username: req.body.username });

        if (!employee) {
            return res.status(404).send({ message: "employee not found" });
        };

        const isValidPassword = bcrypt.compareSync(req.body.password, employee.password);

        if (!isValidPassword) {
            return res.status(400).send({ message: "invalid password" })
        } else {

            const payload = {
                user_id: employee._id,
                name: employee.first_name,
                role: employee.role
            };
            
            const token = generateToken(payload);

            return res.status(200).send({ message: "login successful", token: token, tokenType: "Bearer" });
        }

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

