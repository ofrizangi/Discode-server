const express = require('express');

const router = express.Router()

module.exports = router;

const QuestionModel = require('../models/question');
const AnswerModel = require('../models/answer');


const auth = require("../middleware/auth")

const games = require('../games_information.json')

 
router.post('/:gameName/forum/postQuestion', auth, async (req, res) => {
    const data = new QuestionModel({
        game_name:req.params.gameName,
        content:req.body.content,
        user:req.userId.user_id,
        answers:[]
    })
    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.post('/:gameName/forum/postAnswer/:id', auth,  async (req, res) => {
    const data = new AnswerModel({
        content:req.body.content,
        user:req.userId.user_id,
        question:req.params.id
    })

    try {
        const dataToSave = await data.save();
        const question = await QuestionModel.findById(req.params.id)
        question.answers.push(dataToSave)
        await question.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})



router.get('/:gameName/forum/getAll', auth, async (req, res) => {
    try{
        const data = await QuestionModel.find({"game_name" : req.params.gameName}).populate('answers')

        res.status(200).json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})


//Delete by ID Method
// router.delete('/:gameName/forum/delete/:id', async(req, res) => {
//     ForumModel.findByIdAndRemove(req.params.id, function (err, docs) { 
//         if (err){
//             console.log(err)
//             res.status(500).json({message: err.message})
//         }
//     else{
//         res.status(200).json({})
//         }});
//     })

//localhost:3001/api/maze/forum/delete/63fdd21e56b7b7b67cc8c54c