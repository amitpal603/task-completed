const express = require('express')
const router = express.Router()
const  validation = require('../middleware/validation')
const {registerUser,loginUser,logoutUser} = require('../controllers/userControllers')

//! user routers all 

router.post('/register',validation,registerUser)
router.post('/login',loginUser),
router.post('/logout',logoutUser)
module.exports = router