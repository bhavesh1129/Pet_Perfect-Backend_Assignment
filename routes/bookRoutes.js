// GET /books: To return the list of all the books.
// (In this endpoint the data should be paginated and there must be some sorting parameters to fetch the list in order of most likes or least likes.)
// PUT /books/like/:id: To like a book.
// PUT /books/unlike/:id: To, unlike a book.

const express = require("express");
const router = express();

const { checkLoggedIn } = require("../middlewares/isLoggedIn");
const { showBooks, updateBook, deleteBook, uploadBook, likeBook, unlikeBook } = require("../controllers/bookControllers")

// Having an isAdmin middleware would be better here
router.post("/books/upload", uploadBook);
router.put("/books/update", updateBook);
router.delete("/books/delete", deleteBook);

router.get("/books/", checkLoggedIn, showBooks);
router.put("/books/like/:id", checkLoggedIn, likeBook);
router.put("/books/unlike/:id", checkLoggedIn, unlikeBook);

module.exports = router