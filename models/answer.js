const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    content: {
        required: true,
        type: String
    },
    user: {type: mongoose.Schema.Types.String, ref: "User"},
    question: {type: mongoose.Schema.Types.ObjectId, ref: "Question"}
})


module.exports = mongoose.model('Answer', answerSchema)
