
const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
    row_number: {
        required: true,
        type: Number
    },

    nesting_level : {
        type: Number
    },

    arguments: {type: Array, "default" : []}, 

    block : {type: mongoose.Schema.Types.ObjectId, ref: "Block"},

    level: {type: mongoose.Schema.Types.ObjectId, ref: "Level"}
})

module.exports = mongoose.model('Command_row', commandSchema)