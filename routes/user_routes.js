const express = require('express');

const router = express.Router()

module.exports = router;

const bcrypt = require("bcrypt")

const jwt = require("jsonwebtoken");

const UserModel = require('../models/user');


var passwordValidator = require('password-validator');

// the password must have at least 8 cheracters, less the 30 charecters, 2 digits, no spaces
const valid_password = new passwordValidator().min(8, "Password should be at least 8 charachters long").
                                                max(30, "Password should be be a maximum of 30 characters long").
                                                has().digits(2, "Password should have at least 2 digits").
                                                has().not().spaces(1, "Password should not have spaces")

// register
router.post('/register', async (req, res) => {
    var errors_list = valid_password.validate(req.body.password, {details :true})
    if(errors_list.length != 0){
        errors_list = errors_list.map(item => {return item.message})
        res.status(400).json({message: errors_list})
    } else {
        const user_data = new UserModel({
            _id: req.body.name,
            age: req.body.age,
            password: req.body.password,
            email: req.body.email
        })
        // generate token
        const token = jwt.sign(
            { user_id: user_data._id },
            process.env.TOKEN_KEY,
            {
              expiresIn: process.env.TOKEN_LIFE,
            });
        try {
            // encrrypt password before storing it in the DB
            user_data.password = await bcrypt.hash(user_data.password, 10);
            await user_data.save();
            res.status(200).json({token: token})
        }
        catch (error) {
            res.status(400).json({message: error.message})
        }
    }
})

// sign in
router.post('/login', async (req, res) => {
    try {
        const user_data = await UserModel.findById(req.body.name);
        if(user_data == null){
            res.status(500).json({message : "invalid user name"})
        }
        // compare encrtpted password - every string have the same uniqu hashed value
        else if(await bcrypt.compare(req.body.password , user_data.password)){
            // defining the expiression and the 
            const token = jwt.sign(
                { user_id: user_data._id },
                process.env.TOKEN_KEY,
                {
                  expiresIn: process.env.TOKEN_LIFE,
                });
            res.status(200).json({token: token})
        }
        else {
            res.status(500).json({message : "invalid password"})
        }
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})









/*
for testing token - delete me later!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
*/
const auth = require("../middleware/auth")

router.post("/welcome", auth, (req, res) => {
    console.log(req.user)
    res.status(200).send("Welcome 🙌 ")
});

