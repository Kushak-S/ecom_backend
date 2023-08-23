const mongoose = require('../Database/db_config');
const User = require('../Database/Models/user.model');
const jwt = require('../Helpers/jwt.validator');
const reqValidator = require('../Helpers/req.validator');
const cryptojs = require('crypto-js');
require('dotenv').config();

module.exports = {
    register: async (req, res)=>{
        const {error, value} = reqValidator.signup(req.body);
        if(error) return res.status(400).send(error.details);
        const user = await User.findOne({email: value.email});
        if(user) return res.status(400).send('Email already exists!');
        const newUser = new User({
            name: value.name,
            email: value.email,
            password: cryptojs.AES.encrypt(value.password, process.env.PASS_SECRET_KEY).toString(),
            isAdmin: value.isAdmin,
        });

        try{
            const savedUser = await newUser.save();
            res.status(200).send(savedUser);
        }catch(err){
            res.status(500).send(err);
        }
    },

    login: async (req, res)=>{
        try{
            const {error, value} = reqValidator.login(req.body);
            if(error) return res.status(400).send(error.details);

            const user = await User.findOne({email: value.email});
            if(!user) return res.status(404).send('User not found!');
            const hashedPassword = cryptojs.AES.decrypt(user.password, process.env.PASS_SECRET_KEY);
            const user_password = hashedPassword.toString(cryptojs.enc.Utf8);
            if(user_password !== value.password) return res.status(401).send('Wrong password!');
            const { password, ...verifiedUser} = user._doc;
            const token = 'Bearer ' + jwt.sign_jwt({id: verifiedUser._id, isAdmin: verifiedUser.isAdmin});
            res.status(200).send({...verifiedUser, token});
        }catch(err){
            res.status(500).send(err);
        }
    },

    logout: (req, res)=>{
        res.send('logout api');
    },

    delete: async (req, res)=>{
        try{
            const {error, value} = reqValidator.login(req.body);
            if(error) return res.status(400).send(error.details);

            const userId = req.user.id;
            const user = await User.findById(userId);
            if(!user) return res.status(400).send('Invalid Token!');
            const email = value.email;
            const savedEmail = user.email;
            const hashedPassword = cryptojs.AES.decrypt(user.password, process.env.PASS_SECRET_KEY);
            const jwtPassword = hashedPassword.toString(cryptojs.enc.Utf8);
            if(email !==savedEmail || jwtPassword !== value.password) return res.status(401).send('Wrong Credentials!');
            const deletedUser = await User.findByIdAndDelete(userId);
            const { password, ...verifiedUser} = deletedUser._doc;
            res.status(200).send(verifiedUser);
        }catch(err){
            res.status(500).send(err);
        }
    },
}