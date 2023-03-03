const games = require('../games_information.json')

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
        let number_of_levels = myGames[game_num].number_of_levels
        let locked = false
        for(let i = 1; i <= number_of_levels; i++){
            if( i === 2){
                locked = true
            }
            const leval_data = new LevelModel({
                game_name: myGames[game_num].game_name ,
                level_number : i,
                solved: false,
                locked: locked,
                user: user_id
            })
            const level = await leval_data.save();
            user.levels.push(level)
            await user.save()
            
            await initialize_row_command(level, game_num, myGames)
        }
    }
}

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

module.exports = {initialize_levels};