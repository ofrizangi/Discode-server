const games = require('../information_files/games.json')

const LevelModel = require('../models/level');

const CommandModel = require('../models/command_row');

const UserModel = require('../models/user');

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
            if(myLevels[i].level_number === 2){
                locked = true
            }
            const leval_data = new LevelModel({
                game_name: myGames[game_num].game_name ,
                level_number : myLevels[i].level_number,
                solved: false,
                locked: locked,
                user: user_id,
                max_number_of_rows : myLevels[i].maximum_number_of_rows,
                blocks: myLevels[i].blocks,
                description: myLevels[i].description
            })
            const level = await leval_data.save();
            user.levels.push(level)
            await user.save()
        }
    }
}




/*
command_row list in every level is initialize to be empty,
so this function is irelevent

async function initialize_row_command(level, game_num, myGames) {
    let level_id = level._id
    let number_of_rows = myGames[game_num].number_of_rows
    for(let j = 1; j <= number_of_rows; j++) {
        const row_data = new CommandModel({
            row_number : j,
            block : null,
            level: level_id
        })
        const data = await row_data.save()
        level.solution.push(data)
        await level.save()
    }
}

*/

module.exports = {initialize_levels};