const mongoose = require("mongoose");


const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please provide a title."],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        required: [true, "Please include an Author."]
    },
    likes: {
        type: Number,
    }
});

bookSchema.pre("save", async function(next) {
    this.likes = 0;
    next();
})

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;