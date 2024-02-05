const jwt = require("jsonwebtoken");

const Auth = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader.startsWith("Bearer ")) {

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_PUBLIC, (error, decoded) => {
            if (error) {
                return res.status(400).send({ message: "Invalid token", error: error });
            }

            req.user = decoded;

            next();

        })

    } else {
        return res.status(403).send({ message: "Invalid authorization method" });
    }

};

module.exports = Auth;