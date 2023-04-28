
const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
    block : {type: mongoose.Schema.Types.String, ref: "Block", required: true},

    arguments: [{type: Array}],

    level: {type: mongoose.Schema.Types.ObjectId, ref: "Level"},


    //an array that will contain refrences to other blocks
    inner_blocks: [{type: mongoose.Schema.Types.ObjectId, ref: 'Inner_commands' }],

    outer_block: {type: mongoose.Schema.Types.ObjectId, ref: "Command_row" , default: null},

    outer_block_list_number : {type:Number , default:null}

})

module.exports = mongoose.model('Command_row', commandSchema)