const express = require('express');

const router = express.Router()

module.exports = router;

const auth = require("../middleware/auth")

const CommandRowModel = require('../models/command_row')

const InnerCommandsModel = require('../models/inner_command')

const LevelModel = require('../models/level')

const {delete_inner_commands, create_command_arguments_array, get_complex_number, get_command_in_correct_format} = require('../service/command_row_service')

router.get('/:gameName/levels/:levelNumber/commands/getAll', auth,  async (req, res) => {
    try {
        console.log(req.userId.user_id)
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        console.log(level._id)
        const level_commands = await CommandRowModel.find({"level" : level._id})

        const level_commands_list = []

        // populating the blocks of every level
        for(let i=0;i<level_commands.length;i++){
            await level_commands[i].populate({path: 'block'})
            await level_commands[i].populate({path: 'inner_blocks'})
            level_commands_list.push(await get_command_in_correct_format(level_commands[i]))
        }

        res.json(level_commands_list)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


router.post('/:gameName/levels/:levelNumber/postCommand', auth,  async (req, res) => {
    try {
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})

        const complex_number = await get_complex_number(req.body.block_id)

        var argumnets_array = await create_command_arguments_array(req.body.block_id, complex_number)

        const command = new CommandRowModel({
            block: req.body.block_id,
            level : level._id,
            arguments: argumnets_array,
        })

        const command_saved = await command.save()

        level.solution.splice(req.body.dest_index, 0, command_saved)
        await level.save()

        // creating inner commands lists
        for(let i=0; i<complex_number; i++){
            const inner_commands = new InnerCommandsModel()
            const inner_commands_saved = await inner_commands.save()
            command_saved.inner_blocks.splice(i, 0, inner_commands_saved) 
        }
        await command_saved.save()

        await command_saved.populate('block')
        await command_saved.populate('inner_blocks')
        res.status(200).json(await get_command_in_correct_format(command_saved))
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})


router.post('/:gameName/levels/:levelNumber/postInnerCommand', auth,  async (req, res) => {
    try {
        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
        const outer_command = await CommandRowModel.findById(req.body.outer_row_id)

        const complex_number = await get_complex_number(req.body.block_id)
        var argumnets_array = await create_command_arguments_array(req.body.block_id, complex_number)

        const new_command = new CommandRowModel({
            block: req.body.block_id,
            level : level._id,
            arguments: argumnets_array,
            outer_block: req.body.outer_row_id,
            outer_block_list_number: req.body.list_number,
        })
        const command_saved = await new_command.save();

        // add me as an inner command to the outer block
        const inner_commands = await InnerCommandsModel.findById(outer_command.inner_blocks[req.body.list_number])
        inner_commands.commands.splice(req.body.dest_index, 0, command_saved)
        await inner_commands.save()

        // creating my inner commands lists
        for(let i=0; i<complex_number; i++){
            const inner_commands = new InnerCommandsModel()
            const inner_commands_saved = await inner_commands.save()
            command_saved.inner_blocks.splice(i, 0, inner_commands_saved) 
        }
        await command_saved.save()

        await command_saved.populate('block')
        await command_saved.populate('inner_blocks')
        res.status(200).json(await get_command_in_correct_format(command_saved))
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})



// swapping a command place
router.patch('/:gameName/levels/:levelNumber/swapCommand', auth, async (req, res) => {
    try{

        const level = await LevelModel.findOne({"game_name" : req.params.gameName, "user" : req.userId.user_id, "level_number" : req.params.levelNumber})
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
        outer_command.populate('block')

        const inner_blocks = await InnerCommandsModel.findById(outer_command.inner_blocks[req.body.list_number])
        inner_blocks.splice(req.body.dest_index, 0, inner_blocks.splice(req.body.src_index, 1)[0])
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

        const outer_command_inner_blocks = await InnerCommandsModel.findById(outer_command.inner_blocks[req.body.list_number])

        const deleted_command_id = outer_command_inner_blocks.commands.splice(req.params.index, 1)
        await outer_command_inner_blocks.save()

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

        const new_argumnts = command.arguments
        new_argumnts[req.body.list_number][req.params.index] = req.body.value
        
        await command.updateOne({arguments: new_argumnts})

        res.status(200).json(command)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
