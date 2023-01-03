/*
Just for testing!!!!!!!!!!!!!!!
earase me later.....
*/


const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
})

// here we detemine the DB name
module.exports = mongoose.model('Test', dataSchema)