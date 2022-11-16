const mongoose = require("mongoose");

const connectDB = async() => {
    //Provide your DB_URI here or just create a .env file and add the sensitive info there.
    if (!process.env.DB_URI) {
        throw new Error("Database Connection Failed!❌");
        process.exit(0);
    }
    //Provide your DB_URI here or just create a .env file and add the sensitive info there.
    const conn = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB connected on Port ${conn.connection.host}`);
};

const disconnectDB = async() => {
    try {
        await mongoose.disconnect();
        console.log("\nMongoDB disconnected!");
    } catch (err) {
        console.log("Error, disconnecting MongoDB", err);
    }
};

module.exports = { connectDB, disconnectDB }