var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

const generateToken = (payload) => {

    var privateKey = fs.readFileSync(path.join(__dirname,'../cert/jwt/private.key'),'utf8');

    return jwt.sign(payload, privateKey, {algorithm:'RS256', expiresIn: '1h' });
};

const verifyToken = (token) => {
    try {

        var cert = fs.readFileSync(path.join(__dirname,'../cert/jwt/public.pem'),'utf8'); 
        console.log(cert);
        console.log(token);
        jwt.verify(token, cert,{algorithms:'RS256'}, (err, payload) => {
            if(err){
                console.error(err);
                return null;
            }
            return payload;
        });

    } catch (error) {
        return null;
    }
};

module.exports = { generateToken, verifyToken };
