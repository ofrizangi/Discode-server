const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    game_name: {
        required: true,
        type: String
    },
    content: {
        required: true,
        type: String
    },
    user: {type: mongoose.Schema.Types.String, ref: "User"},
    answers: [{type: mongoose.Schema.Types.ObjectId, ref: "Answer"}]

})


module.exports = mongoose.model('Question', questionSchema)

