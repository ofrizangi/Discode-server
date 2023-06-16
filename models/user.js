const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
    _id: {
        required: [true, 'You must provide a user name'],
        type: String
    },
    age: {
        required: [true, 'You must enter your age'],
        type: Number,
        min: [7, "You must be at least 7 years old"]
    },
    password: {
        required: true,
        type: String
    },
    email: {
        required: [true, 'You must enter yours or your perants email'],
        type: String,
        validate: [validator.isEmail, 'invalid email'],
        unique: true
    },
    levels: [{type: mongoose.Schema.Types.ObjectId, ref: "Level"}]
})

module.exports = mongoose.model('User', userSchema)