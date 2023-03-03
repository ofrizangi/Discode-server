const mongoose = require('mongoose');

/*
Option 1
*/

const levelSchema = new mongoose.Schema({
    game_name: {
        required: true,
        type: String
    },
    level_number: {
        required: true,
        type: Number
    },
    locked: {
        required: true,
        type: Boolean
    },
    solved: {
        required: true,
        type: Boolean
    },
    solution: [{type: mongoose.Schema.Types.ObjectId, ref: "Command_row"}], 
    user: {type: mongoose.Schema.Types.String, ref: "User"}
})



/*
Option 2
*/

// const levelSchema = new mongoose.Schema({
//     _id: {
//         game_name: {
//             required: true,
//             type: String
//         },
//         level_number: {
//             required: true,
//             type: Number
//         },
//         user: {type: mongoose.Schema.Types.String, ref: "User"}
//     },
//     solved: {
//         required: true,
//         type: Boolean
//     },
//     solution: {
//         type: String
//     }
// })

module.exports = mongoose.model('Level', levelSchema)