

const mongoose = require('mongoose');

const validator = require('validator');

const userSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    },
    password: {
        required: true,
        type: String
        // validate: [function(){return valid_password.validate(this.password)}, "invalid password"]
    },
    email: {
        required: true,
        type: String,
        validate: [validator.isEmail, 'invalid email'],
        unique: true // unique is not working
    },
    levels: [{type: mongoose.Schema.Types.ObjectId, ref: "Level"}]
})

module.exports = mongoose.model('User', userSchema)