const express = require("express");
const router = express();

const { checkLoggedIn } = require("../middlewares/isLoggedIn");
const {
    showBooks,
    updateBook,
    deleteBook,
    uploadBook,
    likeBook,
    unlikeBook
} = require("../controllers/bookControllers")

// It would be preferable to use an isAdmin middleware in this case.
router.post("/books/upload", uploadBook);
router.put("/books/update", updateBook);
router.delete("/books/delete", deleteBook);

// "/books" --> To return the complete list of books.
router.get("/books", checkLoggedIn, showBooks);

// "/books/like/:id" --> To enjoy/like a book.
router.put("/books/like/:id", checkLoggedIn, likeBook);

// "/books/unlike/:id:" --> To dislike a book
router.put("/books/unlike/:id", checkLoggedIn, unlikeBook);

module.exports = router