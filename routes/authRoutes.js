//Login / SignUp Basics
const express = require("express");
const router = express();

const { isLoggedIn } = require("../middlewares/isLoggedIn");
const { login, register, logout } = require("../controllers/authControllers")

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router