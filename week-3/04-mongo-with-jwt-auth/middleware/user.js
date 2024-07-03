const jwt = require('jsonwebtoken');
const jwtPassword = require('../index');

function userMiddleware(req, res, next) {
    const token = req.headers.authorization;
    const words = token.split(" ");
    const jwtToken = words[1];
    const decode = jwt.verify(jwtToken,jwtPassword);

    if(decode.username){
        next();
    }else{
        res.status(403).json({
            message: "you are not authorized."
        });
    }
}
module.exports = userMiddleware;