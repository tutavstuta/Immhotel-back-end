const jwtHelper = require('../lib/jwthelper');

const Auth = (role) => {

    try {

        return async (req, res, next) => {

            const authHeader = req.headers["authorization"];
            
            if (authHeader && authHeader.startsWith("Bearer ")) {

                const token = authHeader.split(" ")[1];

                jwtHelper.verifyToken(token).then((decoded) => {

                    if (!role.includes(decoded?.role)) {
                        return res.status(403).send({ message: "no permission to access" });
                    };

                    req.user = decoded;
                    console.log('Token:', req.user);
                    next();
                }).catch((err)=>{
                    console.log(err);
                    return res.send(err);
                });

            } else {

                return res.status(400).send({ message: "invalide authorization" });
            }
        }
    } catch (error) {
        return res.send(error.message);
    }

};

module.exports = Auth;