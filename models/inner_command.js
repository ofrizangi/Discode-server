
const mongoose = require('mongoose');

const innerCommandSchema = new mongoose.Schema({
    commands : [{type: mongoose.Schema.Types.ObjectId, ref: "Command_row"}]
})

module.exports = mongoose.model('Inner_commands', innerCommandSchema)