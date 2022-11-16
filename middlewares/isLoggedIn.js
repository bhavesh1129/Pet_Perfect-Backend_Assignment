const jwt = require('jsonwebtoken');

const checkLoggedIn = async(req, res, next) => {
    try {
        const mainHeader = req.mainHeaders["authorization"];
        const array = mainHeader.split(' ');
        const token = array[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                msg: "There was no token found, Please try again.❌",
            })
        }
    } catch (err) {
        return res.status(401).json({
            success: false,
            msg: "There was no token found, Please try again.❌",
        })
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        next()
    } catch (err) {
        res.status(401).json({
            success: false,
            msg: "Not a valid token, Please try again.❌",
        })
    }
}

module.exports = { checkLoggedIn }