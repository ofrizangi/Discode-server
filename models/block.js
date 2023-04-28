

const mongoose = require('mongoose');

const blockSchema = new mongoose.Schema({
    _id: {
        required: true,
        type: String
    },
    description: [{type: String}],
    color: {
        required: true,
        type: String 
    },
    
    complex : {
        type: Number,
        required: true
    },

    arguments_type: [{type: Array}]
})

module.exports = mongoose.model('Block', blockSchema)
