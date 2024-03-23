const { Customer, validateCustomer, validateCustomerLogin } = require('../models/customer.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../lib/jwthelper');


module.exports.signup = async (req, res) => {
    try {

        const { error } = validateCustomer(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const isExistEmail = await Customer.findOne({ email: req.body.email });

        if (isExistEmail) {
            return res.status(200).send({ message: "username already exists" });
        }

        const password = bcrypt.hashSync(req.body.password, 10);

        const customerData = {
            name: req.body.name,
            password: password,
            telephone: req.body.telephone,
            email: req.body.email
        }

        const customer = await Customer.create(customerData);

        return res.status(200).send({ message: "signup successfully", data: { customer_id: customer._id } });

    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
};

module.exports.login = async (req, res) => {
    try {
        const { error } = validateCustomerLogin(req.body);

        if (error) {
            return res.status(400).send({ message: "validate error", error: error.details[0].message });
        };

        const customer = await Customer.findOne({ username: req.body.username });

        if (!customer) {
            return res.status(404).send({ message: "customer not found" });
        };

        const isValidPassword = bcrypt.compareSync(req.body.password, customer.password);

        if (!isValidPassword) {
            return res.status(400).send({ message: "invalid password" })
        } else {

            const payload = {
                user_id: customer._id,
                name: customer.first_name,
                role: customer.role
            };

            const token = generateToken(payload);

            return res.status(200).send({ message: "login successful", token: token, tokenType: "Bearer" });
        }
    } catch (error) {
        console.error(error);
        return res.send(error.message);
    }
}