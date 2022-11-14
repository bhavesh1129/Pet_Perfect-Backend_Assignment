const jwt = require('jsonwebtoken');
const Author = require('../models/authorModel');

const getAuthorByToken = async (header) => {
    const HL = header.split(' ');
    const token = HL[1];
    if (!token) {
        return {
            success: false,
            msg: "No token found. Please log in again.",
        }
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        let author = await Author.findById(payload.id);
        return {
            success: true,
            author: author
        };
    } catch (err) {
        return {
            success: false,
            msg: "Token is not valid. Please log in again.",
        }
    }
}

module.exports = { getAuthorByToken }