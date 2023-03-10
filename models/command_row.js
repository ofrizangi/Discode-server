
const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
    block : {type: mongoose.Schema.Types.String, ref: "Block", required: true},

    arguments: {type: Array, "default" : []},

    level: {type: mongoose.Schema.Types.ObjectId, ref: "Level"},

    inner_blocks: [{type: mongoose.Schema.Types.ObjectId, ref: "Command_row"}],

})

module.exports = mongoose.model('Command_row', commandSchema)