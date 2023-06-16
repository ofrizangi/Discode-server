const CommandRowModel = require('../models/command_row');
const BlockModel = require('../models/block');
const InnerCommandsModel = require('../models/inner_command')


async function delete_inner_commands(deleted_command){
    const complex_number = await get_complex_number(deleted_command.block)
    // go over all inner lists
    for(let list_number=0; list_number <complex_number; list_number++){
        const inner_commands = await InnerCommandsModel.findByIdAndDelete(deleted_command.inner_blocks[list_number])
        const commands = inner_commands.commands
        for(let i=0; i < commands.length; i++ ){
            const new_deleted_command = await CommandRowModel.findByIdAndDelete(commands[i]._id)
            await delete_inner_commands(new_deleted_command)
        }
    }
}

async function delete_all_level_commands(level_id){
    await CommandRowModel.deleteMany({"level" : level_id})
}


async function get_arguments_number(block_id, place){
    const block = await BlockModel.findById(block_id)
    return block.arguments_type[place].length
}

async function get_complex_number(block_id){
    const block = await BlockModel.findById(block_id)
    return block.complex
}

async function create_command_arguments_array(block_id, complex_number){
    var argumnets_array = [Array(await get_arguments_number(block_id , 0)).fill(null)]
    for(let i=1; i <complex_number; i++ ){
        argumnets_array.push(Array(await get_arguments_number(block_id , i)).fill(null))
    }
    return argumnets_array
}

async function get_command_in_correct_format(command){

    const inner_commands = command.inner_blocks.map(({ commands }) => commands.map(({ _id }) => _id.id))

    const { _id, block, arguments, level, outer_block, outer_block_list_number } = command

    const level_commnad_obj = {
        _id: _id.id,
        block,
        arguments,
        level,
        inner_blocks: inner_commands,
        outer_block: outer_block === null ? null : outer_block.id,
        outer_block_list_number
    }
    return level_commnad_obj
}


module.exports = {delete_inner_commands, delete_all_level_commands, get_arguments_number, get_complex_number, create_command_arguments_array, get_command_in_correct_format};
