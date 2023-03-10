const express = require('express');

const router = express.Router()

module.exports = router;

const auth = require("../middleware/auth")

const CommandRowModel = require('../models/command_row')

const LevelModel = require('../models/level')



router.post('/:gameName/levels/:levelNumber/postCommand', auth,  async (req, res) => {
    try {
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})

        const command = new CommandRowModel({
            block: req.body.block_id,
            level : level._id,
            arguments: [],
        })

        const command_saved = await command.save();
        level.solution.splice(req.body.dest_index, 0, command_saved)
        await level.save()
        res.status(200).json(command_saved)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})



// swapping a command place
router.patch('/:gameName/levels/:levelNumber/swapCommand', auth, async (req, res) => {
    try{

        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        console.log(req.body.src_index)
        console.log(req.body.dest_index)
        await level.solution.splice(req.body.dest_index, 0, level.solution.splice(req.body.src_index, 1)[0])
        const new_level = await level.save()

        res.status(200).json(new_level)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


// deleting a command place
router.delete('/:gameName/levels/:levelNumber/deleteCommand/:index', auth, async (req, res) => {
    try{

        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        row_command_id =  level.solution[req.params.index] 
        level.solution.splice(req.params.index, 1)
        const new_level = await level.save()

        await CommandRowModel.findByIdAndDelete(row_command_id)

        res.status(200).json(new_level)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})