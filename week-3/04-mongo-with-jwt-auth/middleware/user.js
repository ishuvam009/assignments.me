const jwt = require('jsonwebtoken');
const { jwtPassword } = require('../secret');

function userMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const decode = jwt.verify(jwtToken,jwtPassword);

    if(decode.username){
        req.username = decode.username;
        next();
    }else{
        res.status(403).json({
            message: "you are not authorized."
        });
    }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
module.exports = userMiddleware;