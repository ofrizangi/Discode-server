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

    arguments_type: [{type: Array}],

    is_game_block : {
        type: Boolean
    }
})

module.exports = mongoose.model('Block', blockSchema)
