const express = require('express');

const router = express.Router()

module.exports = router;

const LevelModel = require('../models/level');

const auth = require("../middleware/auth")


//Get all Method
router.get('/:gameName/levels/getAll', auth, async (req, res) => {
    try{
        const data = await LevelModel.find({"game_name" : req.params.gameName, "user" : req.userId.user_id})
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Get one Method
router.get('/:gameName/levels/getOne/:levelNumber', auth, async (req, res) => {
    try{
        const level_data = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}).populate('solution')
        // going over all the solution array and populating the block ref
        const my_solution = level_data.solution
        for(let i=0;i<my_solution.length;i++){
            await my_solution[i].populate('block')
        }

        res.json(level_data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Solving a level and unlocking the next one
router.patch('/:gameName/levels/solve/:levelNumber', auth, async (req, res) => {
    try{
        const new_data = await LevelModel.findOneAndUpdate({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}, {solved: true}, {new: true}) // new = return the updated data
        let next_level = parseInt(req.params.levelNumber) + 1
        await LevelModel.findOneAndUpdate({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : next_level}, {locked: false})
        res.status(200).json(new_data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Restart level sulotion
router.patch('/:gameName/levels/restart/:levelNumber', auth, async (req, res) => {
    try {
        const new_data = await LevelModel.findOneAndUpdate({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}, {solved: false}, {new: true}) // new = return the updated data
        res.status(200).json(new_data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})
