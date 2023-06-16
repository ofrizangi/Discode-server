const games = require('../information_files/games.json')

const LevelModel = require('../models/level');

const CommandModel = require('../models/command_row');

const UserModel = require('../models/user');

const fs = require('fs');

const path = require('path');

/*
The function is called after a new user registered to Discode.
It adds to the DB all levels in all games.
*/
async function initialize_levels(user) {
    const user_id = user._id
    var stringGames = JSON.stringify(games)
    var myGames = JSON.parse(stringGames)
    for (let game_num = 0 ; game_num < myGames.length ; game_num++) {

        const levels = require(`../information_files/${myGames[game_num].game_name}.json`)
        var stringLevels = JSON.stringify(levels)
        var myLevels = JSON.parse(stringLevels)

        var locked = false
        for(let i = 0; i < myLevels.length; i++) {
            if(myLevels[i].level_number === 3){
                locked = true
            }
            const leval_data = new LevelModel({
                game_name: myGames[game_num].game_name ,
                level_number : myLevels[i].level_number,
                solved: false,
                locked: locked,
                user: user_id,
                last_command_id: 1,
                max_number_of_rows : myLevels[i].max_number_of_rows,
                blocks: myLevels[i].blocks,
                description: myLevels[i].description,
                data:myLevels[i].data,
                expected_solution: myLevels[i].expected_solution,
                video_src: myLevels[i].video_src,
                editor_code: myLevels[i].editor_code,
                function_arguments : myLevels[i].function_arguments,
                best_score: myLevels[i].best_score,
            })
            const level = await leval_data.save();
            user.levels.push(level)
            await user.save()
        }
    }
}



function get_editor_code_initial_value(game_name, level_number){
    const levels = require(`../information_files/${game_name}.json`)
    var stringLevels = JSON.stringify(levels)
    var myLevels = JSON.parse(stringLevels)
    const level = myLevels.find(obj => obj.level_number === parseInt(level_number))
    return level.editor_code
}


module.exports = {initialize_levels, get_editor_code_initial_value};