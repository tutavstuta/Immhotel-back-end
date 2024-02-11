var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

const generateToken = (payload) => {

    var privateKey = fs.readFileSync(path.join(__dirname, '../.key/private.key'), 'utf8');

    return jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '1h' });
};

const verifyToken = (token) => {

        var cert = fs.readFileSync(path.join(__dirname, '../.key/private.key'), 'utf8');
        
        return new Promise((resolve, reject) => {
            jwt.verify(token, cert, (err, payload) => {
                if (err) {
                
                   reject(err);
                }else{
                    resolve(payload);
                }
            });
            
        })
};

module.exports = { generateToken, verifyToken };
