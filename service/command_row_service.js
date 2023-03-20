

const CommandRowModel = require('../models/command_row');
const BlockModel = require('../models/block');



async function delete_inner_commands(deleted_command){
    const inner_commands = deleted_command.inner_blocks
    for(let i=0; i < inner_commands.length; i++ ){
        const new_deleted_command = await CommandRowModel.findByIdAndDelete(inner_commands[i])
        await delete_inner_commands(new_deleted_command)
    }
}


async function delete_all_level_commands(level_id){
    await CommandRowModel.deleteMany({"level" : level_id})
}


async function get_arguments_number(block_id){
    const block = await BlockModel.findById(block_id)
    console.log(block.arguments_type.length)
    return block.arguments_type.length
}


module.exports = {delete_inner_commands, delete_all_level_commands, get_arguments_number};
