const express = require('express');

const router = express.Router()

module.exports = router;

const auth = require("../middleware/auth")

const games = require('../information_files/games.json')


//Get all Method
router.get('/getAll', auth, (req, res) => {
    try{
        var stringGames = JSON.stringify(games)
        var myGames = JSON.parse(stringGames)
        const gameList = []        
        for (let game_num = 0 ; game_num < myGames.length ; game_num++){
            gameList[game_num] ={"game_name": myGames[game_num].game_name}
        }
        res.json(gameList)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
