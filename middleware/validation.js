const validateRegister = (req,res,next) => {
    const {username,password} = req.body

    if(!username || !password){
        return res.status(400).json({
            success:false,
            message:'All fields are required'
        })
    }

    if(password.length < 6){
        return res.status(400).json({
            success:false,
            message : 'Password must be at least 6 digits or characters long'
        })
    }
    
    if(!/^[a-zA-Z][a-zA-Z0-9_-]{2,29}$/.test(username)){
        return  res.status(400).json({
            success:false,
            message:'Invalid format'
        })
    }
    next()
}

module.exports = validateRegister