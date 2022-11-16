const jwt = require('jsonwebtoken');
const Author = require('../models/authorModel');

const getAuthorByToken = async(mainHeader) => {
    const array = mainHeader.split(' ');
    const token = array[1];
    if (!token) {
        return {
            success: false,
            msg: "There was no token found, Please try again.❌",
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
            msg: "Not a valid token, Please try again.❌",
        }
    }
}

module.exports = { getAuthorByToken }