

const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String
    },
    description: {
        required: true,
        type: String
    },
    color: {
        required: true,
        type: String 
    },
    
    complex : {
        type: Boolean,
        required: true
    },

    arguments_type: {type: Array}
})

module.exports = mongoose.model('Block', blockSchema)
