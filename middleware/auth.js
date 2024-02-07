const jwtHelper = require('../lib/jwthelper');

const Auth = (role) => {

    console.log(role);

    return async (req, res, next) => {

        const authHeader = req.headers["authorization"];

        if (authHeader && authHeader.startsWith("Bearer ")) {

            const token = authHeader.split(" ")[1];

            const decoded = await jwtHelper.verifyToken(token);
            
            if (!role.includes(decoded?.role)) {
                return res.status(403).send({ message: "no permission to access" });
            };

            req.user = decoded;

            next();

        } else {

            return res.status(400).send({ message: "invalide authorization" });
        }
    }
};

module.exports = Auth;