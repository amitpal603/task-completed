const jwt = require('jsonwebtoken')
require('dotenv')

const userAuth = (req,res,next) => {
  if(req.session.user){
    req.userId = req.session.user?.userId
    return next()
  }
  const authHeader = req.headers['authorization']

  if(!authHeader){
    return res.status(403).json({
        success:false,
        message:'did not provide authorization token please token .. ?'
    })
  }

  const token = authHeader && authHeader.split(" ")[1]

  if(!token){
    return res.status(403).json({
        success : false,
        message : 'access token required login please login'
    })
  }

  try {
    const decodeInfo = jwt.verify(token,process.env.JWT_PRIVATE_KEY)
    console.log(decodeInfo)

    req.userId = decodeInfo.userId
    next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token, please login again",
    });
  }
  next()
}

module.exports = userAuth