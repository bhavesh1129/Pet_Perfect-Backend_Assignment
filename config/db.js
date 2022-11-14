const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.DB_URI) {
        throw new Error("DB Connection Unsuccessful");
        process.exit(0);
    }
    const conn = await mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log("\nMongo disconnected...");
    } catch (err) {
        console.log("Error disconnecting Mongo: ", err);
    }
};

module.exports = { connectDB, disconnectDB }
