const express = require('express');

const router = express.Router()

module.exports = router;

const auth = require("../middleware/auth")

const CommandRowModel = require('../models/command_row')

const LevelModel = require('../models/level')

const {delete_inner_commands, get_arguments_number} = require('../service/command_row_service')


router.get('/:gameName/levels/:levelNumber/commands/getAll', auth,  async (req, res) => {
    try {
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        console.log(level._id)
        const level_commands = await CommandRowModel.find({"level" : level._id})

        // populating the blocks of every level
        for(let i=0;i<level_commands.length;i++){
            await level_commands[i].populate('block')
        }

        res.json(level_commands)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


router.post('/:gameName/levels/:levelNumber/postCommand', auth,  async (req, res) => {
    try {
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})

        const command = new CommandRowModel({
            block: req.body.block_id,
            level : level._id,
            arguments: Array(await get_arguments_number(req.body.block_id)).fill(null),
        })

        const command_saved = await command.save();
        level.solution.splice(req.body.dest_index, 0, command_saved)
        await level.save()

        await command_saved.populate('block')
        res.status(200).json(command_saved)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


router.post('/:gameName/levels/:levelNumber/postInnerCommand', auth,  async (req, res) => {
    try {
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        const outer_command = await CommandRowModel.findById(req.body.outer_row_id)

        const new_command = new CommandRowModel({
            block: req.body.block_id,
            level : level._id,
            arguments: Array(await get_arguments_number(req.body.block_id)).fill(null),
            outer_block: req.body.outer_row_id 
        })

        const command_saved = await new_command.save();

        outer_command.inner_blocks.splice(req.body.dest_index, 0, command_saved)
        await outer_command.save()

        await command_saved.populate('block')
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


// swapping a command place
router.patch('/:gameName/levels/:levelNumber/swapInnerCommand', auth, async (req, res) => {
    try{
        const outer_command = await CommandRowModel.findById(req.body.outer_row_id)
        outer_command.inner_blocks.splice(req.body.dest_index, 0, outer_command.inner_blocks.splice(req.body.src_index, 1)[0])
        const new_command = await outer_command.save()

        res.status(200).json(new_command)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})



// deleting a command
router.delete('/:gameName/levels/:levelNumber/deleteCommand/:index', auth, async (req, res) => {
    try{

        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        row_command_id =  level.solution[req.params.index] 
        level.solution.splice(req.params.index, 1)
        const new_level = await level.save()

        deleted_command = await CommandRowModel.findByIdAndDelete(row_command_id)
        await delete_inner_commands(deleted_command)

        res.status(200).json(new_level)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


// delete an inner command
router.delete('/:gameName/levels/:levelNumber/deleteInnerCommand/:index', auth, async (req, res) => {
    try{
        const outer_command = await CommandRowModel.findById(req.body.outer_row_id)
        const deleted_command_id = outer_command.inner_blocks.splice(req.params.index, 1)
        console.log(outer_command)
        await outer_command.save()

        const deleted_command = await CommandRowModel.findByIdAndDelete(deleted_command_id)
        await delete_inner_commands(deleted_command)
        res.status(200).json(deleted_command)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


// post an argument
router.post('/:gameName/levels/:levelNumber/rows/:row_number/postArgument/:index', auth, async (req, res) => {
    try{
        const command = await CommandRowModel.findById(req.params.row_number)
        
        command.arguments[req.params.index] = req.body.value

        await command.save()
        res.status(200).json(command)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
