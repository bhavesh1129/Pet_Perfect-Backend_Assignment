const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");


const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
    },
    password: {
        type: String,
        required: [true, "Please enter a strong Password"],
        minlength: [5, "Passwords must be at least 5 characters long."]
    },
    email: {
        type: String,
        required: [true, "Please enter your email address."],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter your  valid email address."],
    },
    phone_no: {
        type: Number,
        unique: true,
        required: [true, 'Please enter your phone number'],
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
    }],
});

authorSchema.pre("save", async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;