const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        required: true
    },

    lastName: {
        type: String,
        trim: true,
        required: true
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        required: true
    
    },

    password: {
        type: String,
        trim: true,
        required: true,
        max: 20
    },

    DoB: Date

    },{

    gender: {
        type: String,
        trim: true,
        required: true
    },

    telephone: Number,
    
})

module.exports = mongoose.model("User", userSchema)