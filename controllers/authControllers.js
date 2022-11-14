const Author = require("../models/authorModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const session = require("sessionstorage")


const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    });
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, phone_no } = req.body
        let authorTest = await Author.findOne({ email });
        if (authorTest)
            return res.status(401).send({
                success: false,
                msg: "Email Already Exists"
            });

        authorTest = await Author.findOne({ phone_no });
        if (authorTest)
            return res.status(404).send({
                success: false,
                msg: "Phone Number already Exists"
            });

        const author = new Author({
            name: name,
            email: email,
            password: password,
            phone_no: phone_no
        });

        await author.save();
        res.status(200).send(
            `${name} registered successfully`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Error while registering"
        });
    }
}

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                msg: "Email or Password is missing"
            });
        }
        const author = await Author.findOne({ email });
        let isMatch = false;
        if (!author) {
            isMatch = false;
            return res.status(404).send({
                success: false,
                msg: "Author Doesn't Exist"
            });
        } else {
            isMatch = await bcrypt.compare(password, author.password);
        }

        if (!isMatch) {
            return res.status(400).send({
                success: false,
                msg: "Invalid Credentials"
            });
        } else {
            token = createToken(author._id);
            session.setItem("jwt", token);
            console.log(`${email} logged in`)
            return res.json({ token: token })
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Internal Server Error"
        });;
    }
}

const logout = async (req, res, next) => {
    try {
        let token = req.headers["authorization"];
        let author = await Author.exists({ token });
        if (author) {
            await Author.updateOne(
                { _id: author._id },
                {
                    $set: {
                        token: null,
                    },
                }
            );
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
