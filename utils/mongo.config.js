const mongoose = require("mongoose");

module.exports = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
         console.log("::::> Connected to MongoDB");

    } catch (error) {
        console.log("::::> Error connecting to MongoDB: ", error.message);
        throw new Error(error.message);

    }
    

}

