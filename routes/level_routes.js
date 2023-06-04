const express = require('express');

const router = express.Router()

module.exports = router;

const LevelModel = require('../models/level');

const auth = require("../middleware/auth")

const {delete_all_level_commands} = require('../service/command_row_service')

const {get_editor_code_initial_value} = require('../service/level_service')


// const {get_level_data} = require('../service/level_service')

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
        const current_level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}).populate('blocks')

        res.json(current_level)
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
        const new_data = await LevelModel.findOneAndUpdate({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}, {solved: false, solution: [], last_command_id:1, editor_code: get_editor_code_initial_value(req.params.gameName, req.params.levelNumber)}, {new: true}).populate('blocks') // new = return the updated data
        await delete_all_level_commands(new_data._id)
        res.status(200).json(new_data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})



//Post level code editor
router.patch('/:gameName/levels/postCode/:levelNumber', auth, async (req, res) => {
    try {
        const new_data = await LevelModel.findOneAndUpdate({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}, {editor_code: req.body.code}, {new: true})
        res.status(200).json(new_data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})

//Post best score
router.patch('/:gameName/levels/postBestScore/:levelNumber', auth, async (req, res) => {
    try {
        const new_data = await LevelModel.findOneAndUpdate({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber}, {best_score: req.body.best_score}, {new: true})
        res.status(200).json(new_data)
    }
    catch(error) {
        res.status(500).json({message: error.message})
    }
})