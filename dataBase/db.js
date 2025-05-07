const mongoose = require('mongoose')


const connectToDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/bill_invoice`);
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error("Connection error:", err);
    }
};

module.exports = connectToDB;