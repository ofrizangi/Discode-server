

const mongoose = require('mongoose');

const validator = require('validator');

const dataSchema = new mongoose.Schema({
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
    }
})

module.exports = mongoose.model('User', dataSchema)