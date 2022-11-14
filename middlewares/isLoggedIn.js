const jwt = require('jsonwebtoken');
const Author = require('../models/authorModel');

const checkLoggedIn = async (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        const HL = header.split(' ');
        const token = HL[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "No token found. Please log in again.",
            })
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: "No token found. Please log in again.",
        })
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        res.status(401).json({
            success: false,
            msg: "Token is not valid. Please log in again.",
        })
    }
}

module.exports = { checkLoggedIn }