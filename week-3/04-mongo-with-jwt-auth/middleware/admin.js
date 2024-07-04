const jwt = require('jsonwebtoken');
const { jwtPassword } = require('../secret');

function adminMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const word = token.split(" ");
    const jwtToken = word[1];
    const decode = jwt.verify(jwtToken,jwtPassword);

    if(decode.username){
        req.username = decode.username;
        next()
    }else{
        res.status(403).json({
            message: "You are not authenticated."
        })
    }
}
module.exports = adminMiddleware;