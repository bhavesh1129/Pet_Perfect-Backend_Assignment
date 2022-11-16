//Node Packages
const express = require("express");
const bodyParser = require("body-parser");

//Modules
const { connectDB } = require("./config/db");
const { seedRandomData } = require("./seed.js")

//Importing Routes
const authorRoutes = require('./routes/authorRoutes');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

//.env File
require("dotenv").config();

const app = express();
const TEST_PORT = 8000;

//Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/test", (req, res) => {
    res.send("The server is now operational!");
})

app.use(authRoutes);
app.use(authorRoutes);
app.use(bookRoutes);


app.listen(process.env.PORT || TEST_PORT, async() => {
    try {
        console.log(`Server is listening at port ${process.env.PORT || TEST_PORT}`);
        await connectDB();
        await seedRandomData(10);
    } catch (err) {
        console.log("Connection to MongoDB was lost.\n" + err);
        process.exit();
    }
});