const jwt = require('jsonwebtoken')
require('dotenv')
const authUser = (req,res,next) => {
    const authorizationHeader = req.headers['authorization']

    if(!authorizationHeader) {
        res.status(403).json({
            success : false,
            message : 'please provide authorization token'
        })
    }

    const token = authorizationHeader && authorizationHeader.split(" ")[1]

    if(!token){
        res.json({
            success:false,
            message : 'please token provide'
        })
    }

    try {
        const decode = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        console.log(decode);
        
    } catch (error) {
        return res.status(401).json({
      success: false,
      message: "Invalid or expired token, please login again",
    });
    }
}

module.exports = authUser