const express = require("express");
const router = express();

const {
    getAuthors,
    getAuthorbyID,
    getCurrentAuthor,
    updateAuthor,
    deleteAuthor
} = require("../controllers/authorControllers")

// "/authors" --> To return a response for each author in the database, together with the number of books released by that author.
router.get("/authors", getAuthors);

// "/authors/me" --> To return the author's details with the given author id and a list of books.
router.get("/authors/me", getCurrentAuthor);

// "/authors/:id" --> To get the information about the logged-in author.
router.get("/authors/:id", getAuthorbyID);

// "/authors/update" --> To update the information about the author.
router.put("/authors/update", updateAuthor);

// "/authors/delete" --> To delete the information about the author.
router.delete("/authors/delete", deleteAuthor);


module.exports = router