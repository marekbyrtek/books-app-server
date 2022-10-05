require("dotenv").config();

const jwt = require("jsonwebtoken");

exports.verify = (req, res, next) => {
    const accessToken = req.header("accessToken");
    if (accessToken) {
        jwt.verify(accessToken, "secretKey", (err, user) => {
            if (err) {
                return res.status(403).json({
                    message: "Token is not valid"
                })
            }
            req.user = user;
            next();
        })
    } else {
        res.status(401).json({
            message: "You are not authenticated"
        })
    }
}