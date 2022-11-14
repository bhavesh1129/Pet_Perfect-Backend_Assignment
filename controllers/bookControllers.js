const Author = require("../models/authorModel");
const Book = require("../models/bookModel");
const jwt = require('jsonwebtoken')

const { getAuthorByToken } = require('../middlewares/getAuthorByToken');

const showBooks = async (req, res, next) => {
    try {
        const {page = 1, limit = 5} = req.query
        const book = await Book.find()
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort("-likes");
        if (!book)
            return res.status(404).send({
                success: false,
                msg: "book Not Found"
            });

        res.status(200).send({
            success: true,
            no_of_books: book.length,
            book
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch books"
        });
    }
}

const uploadBook = async (req, res, next) => {
    try {
        const { title, author: author } = req.body
        let bookTest = await Book.findOne({ title });
        if (bookTest)
            return res.status(401).send({
                success: false,
                msg: "Book Already Exists"
            });
        const book = new Book({
            title: title,
            author: author
        });

        await book.save();
        res.status(200).send(
            `${title} registered successfully`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch books"
        });
    }
}
const updateBook = async (req, res, next) => {
    try {
        const { id, title, author: author } = req.body
        let book = await Book.findById(id);
        if (!book)
            return res.status(404).send({
                success: false,
                msg: "Book Not Found"
            });
        const new_book = new Book({
            title: title || book.title,
            author: author || book.author,
        })
        // console.log(new_book)
        book = await Book.findByIdAndUpdate(id, { title: new_book.title, author: new_book.author });
        res.status(200).send(
            `${title} updated successfully`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch books"
        });
    }
}

const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.body
        let book = await Book.findById(id);
        if (!book)
            return res.status(404).send({
                success: false,
                msg: "Book Not Found"
            });
        book = await Book.findByIdAndDelete(id);
        res.status(200).send(
            `${id} deleted successfully`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch books"
        });
    }
}

const likeBook = async (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        const author_response = await getAuthorByToken(header);
        if (author_response.success == "false") {
            return res.status(403).send({
                success: false,
                msg: "Token in Valid, Login Again!"
            });
        }
        let author = author_response.author;
        const book_id = req.params.id;
        let book = await Book.findById(book_id);
        if (author.likes.includes(book._id)) {
            return res.status(401).send({
                success: false,
                msg: "You Cannot Like the book Twice"
            });
        } else {
            // console.log(author.likes);
            author.likes.push(book._id);
        }
        // console.log(author.likes);
        book.likes = book.likes + 1;
        book = await Book.findByIdAndUpdate(book_id, book)
        author = await Author.findByIdAndUpdate(author._id, author);
        return res.status(200).send({
            success: true,
            msg: "Liked a book"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch books"
        });
    }
}

const unlikeBook = async (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        const author_response = await getAuthorByToken(header);
        if (author_response.success == "false") {
            return res.status(403).send({
                success: false,
                msg: "Token in Valid, Login Again!"
            });
        }
        let author = author_response.author;
        const book_id = req.params.id;
        let book = await Book.findById(book_id);
        if (author.likes.includes(book._id) == false) {
            return res.status(401).send({
                success: false,
                msg: "You never liked the book!"
            });
        } else {
            for (var i = 0; i < author.likes.length; i++) {
                if (author.likes[i] === book_id) {
                    var spliced = author.likes.splice(i, 1);
                }
            }
        }
        // console.log(author.likes);
        book.likes = book.likes - 1;
        book = await Book.findByIdAndUpdate(book_id, book)
        author = await Author.findByIdAndUpdate(author._id, author);
        return res.status(200).send({
            success: true,
            msg: "Disliked a book"
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch books"
        });
    }
}


module.exports = { showBooks, updateBook, deleteBook, uploadBook, likeBook, unlikeBook };
