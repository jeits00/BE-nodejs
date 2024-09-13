const mongoose = require("mongoose");

// main().catch(err => console.log(err));

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connect Success!");
    } catch (error) {
        console.log("Connect Error!", error);
    }
}
