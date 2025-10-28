const initializeSession = (req, res,next) => {
    if(req.session.user){
        req.userId = req.session.user?.userId
    }
    next()
}

const checkSession = (req , res , next) => {
        if(!req.session.user){
            return res.status(401).json({
                success : false,
                message :'Session expired please login again'
            })
        }
        next()
}

module.exports = {initializeSession,checkSession}