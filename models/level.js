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
    description: {
        type: String
    },
    locked: {
        required: true,
        type: Boolean
    },
    solved: {
        required: true,
        type: Boolean
    },
    solution: [{type: mongoose.SchemaTypes.Mixed, ref: "Command_row"}], 
    max_number_of_rows : {
        type: Number
    },
    blocks : [{type: mongoose.Schema.Types.String, ref: "Block"}],

    user: {type: mongoose.Schema.Types.String, ref: "User"},

    last_command_id : {type:Number, required:true},

    expected_solution:{
        type: mongoose.SchemaTypes.Mixed
    },
    best_score:{
        type: Number
    },
    video_src:{
        type: String
    },
    data:{
        type: mongoose.SchemaTypes.Mixed
    },
    editor_code:{
        type:String,
        default: ""
    },
    function_arguments:{
        type: Array
    }
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