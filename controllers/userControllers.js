const User = require('../models/userSchema')
const Task = require('../models/taskSchema')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const registerUser = async (req,res) => {
    try {
        const {username,password} = req.body
       const isExist = User.findOne({username})

       if(isExist){
        return res.status(400).json({
            success:false,
            message:'User already exist with this username'
        })
       }

       const hashPassword = await argon2.hash(password)

       const user = new User({username,password : hashPassword})

       await user.save()

       const token = jwt.sign({userId : user._id},process.env.ACCESS_TOKEN_SECRET,{
        expiresIn : '7d'
       })

       req.session.user = {
        userId : user._id.toString(),
       }
      
       await new Promise((resolve,reject) => {
        req.session.save((err) => {
            if(err) reject(err)
              else  resolve()
        })
       })
       return res.status(201).json({
        success:true,
        message :'User register successfully',
        user : {
            userId : user._id,
            username : user.username
        },
        token
       })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"server error during register"
        })
    }
}

const loginUser = async (req,res) => {
    try {
        const {username,password} = req.body

        const user = await User.findOne({username})

        if(!user){
            res.status(401).json({
                success:false,
                message:'invalid credentials'
            })
        }

        const isPassword = await argon2.verify(user.password,password)

        if(!isPassword){
            res.status(401).json({
                success:false,
                message:'invalid credentials'
            })
        }
        const  token = jwt.sign({userId : user._id},process.env.ACCESS_TOKEN_SECRET,{
            expiresIn : "7d"
        })

        req.session.user = {
            userId : user._id.toString()
        }

         await new Promise((resolve,reject) => {
        req.session.save((err) => {
            if(err) reject(err)
              else  resolve()
        })
       })
        res.status(200).json({
            success:true,
            message:'Login successfully',
            user: {
                userId : user._id
            },
            token
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"server error during register"
        })
    }
}

const getMe = async (req , res) => {
    try {
        if(req.session.user) {
            return res.json({
                success:true,
                user : req.session.user,
                fromSession : true
            })
        }

        const user = await User.findById(req.userId)

        if(!user){
            return res.status(404).json({
                success:false,
                message : 'User not found'
            })
        }

        res.json({
            success:true,
            user: {
                userId : user._id,
                username : user.username
            },
            fromSession : true
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:'server error'
        })
    }
}

const logoutUser = async(req,res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({
                success:false,
                message: 'Logout failed'
            })
        }
        res.clearCookie('connect.sid')

        res.json({
            success:true,
            message: 'Logout successfully'
        })
    })
}
module.exports = {registerUser,loginUser,getMe,logoutUser}