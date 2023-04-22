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
            gameList[game_num] ={"game_name": myGames[game_num].game_name,
                                  "game_img": "https://drive.google.com/uc?export=download&id=" + myGames[game_num].game_img
                                }
        }
        res.json(gameList)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})




/*
currently unrelevent becuase a change in implemetation

const {get_blocks} = require('../service/block_service')

//Get a game blocks
router.get('/get/:gameName/blocks', auth, async (req, res) => {
    try {
        var stringGames = JSON.stringify(games)
        var myGames = JSON.parse(stringGames)        
        for (let game_num = 0 ; game_num < myGames.length ; game_num++){
            if(req.params.gameName === myGames[game_num].game_name){
                res.status(200).json(await get_blocks(myGames[game_num].blocks))
                break
            }
        }
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


*/