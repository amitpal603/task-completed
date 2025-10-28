const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db')
const taskRouter = require('./routers/taskRouter')
const cors = require('cors')
const session = require('express-session')
const helmet = require('helmet')
const userRoutes = require('./routers/userRoutes')
const {initializeSession} = require('./middleware/session')
const MongoDBStore = require('connect-mongodb-session')(session)

const corsOptions = {
    origin :['https://task-add-daily.vercel.app',
    'http://localhost:5173'],
    methods : ["GET","POST","PUT","DELETE"],
    credential : true,
    allowedHeaders : ['Content-Type','Authorization']
    
}
const app = express()
connectDB()
app.use(cors(corsOptions))
app.use(helmet())
app.use(express.json())
app.use(session({
    secret : process.env.SESSION_SECRET_KEY,
    resave : false,
    saveUninitialized : true,
    store : MongoDBStore({
        mongoUrl : process.env.MONGODB_URI,
        collection : 'sessions',
        ttl : 7 * 24 * 60 *60
    }),
    cookie:{
        secure : process.env.NODE_ENV === "Production",
        httpOnly : true,
        maxAge : 7 * 24 * 60 *60 *1000,
        sameSite : process.env.NODE_ENV === 'Production' ? 'none' : 'lax'
    }
}))
app.use(initializeSession)
app.use('/api/task',taskRouter)
app.use('/api/user',userRoutes)

app.get('/health',(req,res) => {
    res.json({
        success:true,
        message: "server is running",
        session : !!req.session.user
    })
})
app.get('/',(req,res) => {
 res.send('Hello')
})

const PORT = process.env.PORT || 4000

app.listen(PORT,() => {
    console.log(`server listen or running http://localhost:${PORT}`);
   
})