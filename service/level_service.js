const games = require('../games_information.json')

const LevelModel = require('../models/level');

/*
The function is called after a new user registered to Discode.
It adds to the DB all levels in all games.
*/
async function initialize_levels(user_id){
    var stringGames = JSON.stringify(games)
    var myGames = JSON.parse(stringGames)
    for (let game_num = 0 ; game_num < myGames.length ; game_num++){
        let number_of_levels = myGames[game_num].number_of_levels
        let locked = false
        for(let i=1 ; i<=number_of_levels; i++){
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
            await leval_data.save();
        }
    }
}

module.exports = {initialize_levels};