const Author = require("../models/authorModel");
const Book = require("../models/bookModel");
const jwt = require('jsonwebtoken')
const { getAuthorByToken } = require('../middlewares/getAuthorByToken')



const getAuthors = async (req, res, next) => {
    try {
        const authors = await Author.find();
        // console.log(authors)
        if (!authors)
            return res.status(404).send({
                success: false,
                msg: "Author Not Found"
            });
        let author_list = [];
        for (var i = 0; i < authors.length; i++) {
            let author = authors[i];
            id = author._id;
            let books_written = await Book.find({ author: id });
            // console.log(books_written.length);
            no_of_books = books_written.length;
            author_list.push({
                author,
                no_of_books
            });

            author_list.sort()
        }
        res.status(200).send({
            success: true,
            total_count: author_list.length,
            author_list
        });
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch Authors"
        });
    }
}

const getAuthorbyID = async (req, res, next) => {
    // console.log(req.params.id);
    try {
        const author = await Author.findById(req.params.id);
        if (!author)
            return res.status(404).send({
                success: false,
                msg: "Author Not Found"
            });

        let books_written = await Book.find({ author: author._id });
        // console.log(books_written.length);
        res.status(200).send({
            success: true,
            author,
            books_written,
        });
    } catch (err) {
        console.log(err);
    }
}

const getCurrentAuthor = async (req, res, next) => {
    try {
        const header = req.headers["authorization"];
        const author_response = await getAuthorByToken(header);
        if (author_response.success == "false") {
            return res.status(500).send({
                success: false,
                msg: "Token in Valid, Login Again!"
            });
        } else {
            let books_written = await Book.find({ author: author_response.author._id });
            return res.status(200).send({
                success: true,
                author: author_response.author, 
                books_written
            });
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to verify token"
        });
    }
}

const updateAuthor = async (req, res, next) => {
    try {
        const { id, name, phone_no, email } = req.body
        let author = await Author.findById(id);
        if (!author)
            return res.status(404).send({
                success: false,
                msg: "Author Not Found"
            });
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

        const new_author = new Author({
            name: name || author.name,
            email: email || author.email,
            phone_no: phone_no || author.phone_no
        });
        console.log(new_author);
        author = await Author.findByIdAndUpdate(id, { name: new_author.name, email: new_author.email, phone_no: new_author.phone_no });
        res.status(200).send(
            `${new_author.name} updated successfully`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch authors"
        });
    }
}
const deleteAuthor = async (req, res, next) => {
    try {
        const { id } = req.body
        let author = await Author.findById(id);
        author = await Author.findByIdAndDelete(id)
        res.status(200).send(
            `${id} deleted successfully`
        );
    } catch (err) {
        console.log(err)
        return res.status(500).send({
            success: false,
            msg: "Unable to fetch authors"
        });
    }
}

module.exports = { getAuthors, getAuthorbyID, getCurrentAuthor, updateAuthor, deleteAuthor };
