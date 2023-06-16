const BlockModel = require('../models/block');

const blocks = require('../information_files/blocks.json')

/*
The function will remove the database at begining of every run, 
and will create a new one with updated blocks
*/
async function initialize_blocks() {
    await BlockModel.collection.drop()

    var stringBlocks = JSON.stringify(blocks)
    var myBlocks = JSON.parse(stringBlocks)
    for (let block_num = 0 ; block_num < myBlocks.length ; block_num++) {
        const block_data = new BlockModel({
            _id: myBlocks[block_num]._id ,
            color : myBlocks[block_num].color,
            arguments_type: myBlocks[block_num].arguments_type,
            complex: myBlocks[block_num].complex,
            description: myBlocks[block_num].description,
            is_game_block : myBlocks[block_num].is_game_block
        })
        await block_data.save()
    }
}

module.exports = {initialize_blocks};
