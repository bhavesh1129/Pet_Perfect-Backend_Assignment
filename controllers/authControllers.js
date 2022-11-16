const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const session = require("sessionstorage")
const Author = require("../models/authorModel");

// Expiry date(cookies)
const maxAge = 3 * 24 * 60 * 60;

//Provide your JWT_SECRET here or just create a .env file and add the sensitive info there.
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

const register = async(req, res) => {
    try {
        const { name, email, password, phone_no } = req.body
        let authorTest = await Author.findOne({ email });
        if (authorTest)
            return res.status(401).send({
                success: false,
                msg: "Email is already in use."
            });

        authorTest = await Author.findOne({ phone_no });
        if (authorTest)
            return res.status(404).send({
                success: false,
                msg: "There is already the same phone number in use."
            });

        const author = new Author({
            name: name,
            email: email,
            password: password,
            phone_no: phone_no
        });

        await author.save();
        res.status(200).send(
            `${name} succesfully registered!`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "An error occurred while registering.❌"
        });
    }
}

const login = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                msg: "There is no email or password."
            });
        }
        const author = await Author.findOne({ email });
        let isPresent = false;
        if (!author) {
            isPresent = false;
            return res.status(404).send({
                success: false,
                msg: "There is no author."
            });
        } else {
            isPresent = await bcrypt.compare(password, author.password);
        }

        if (!isPresent) {
            return res.status(400).send({
                success: false,
                msg: "Invalid Identification"
            });
        } else {
            token = createToken(author._id);
            session.setItem("jwt", token);
            console.log(`${email} signed in`)
            return res.json({ token: token })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Error on the Internal Server❌"
        });;
    }
}

const logout = async(req, res) => {
    try {
        let token = req.headers["authorization"];
        let author = await Author.exists({ token });
        if (author) {
            await Author.updateOne({ _id: author._id }, {
                $set: {
                    token: null,
                },
            });
            console.log(`${author._id} logged Out`);
            return res.status(200).send({
                success: true,
                msg: "Logged Out Successfully",
            });
        } else {
            return res.status(400).send({
                success: false,
                msg: "Not Logged In"
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Internal Server Error"
        });
    }
}

module.exports = { register, login, logout };