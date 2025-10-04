const express = require('express')
require('dotenv').config()
const connectDB = require('./config/db')
const taskRouter = require('./routers/taskRouter')
const cors = require('cors')

const corsOptions = {
    origin :['https://task-add-daily.vercel.app',
    'http://localhost:5173'],
    methods : ["GET","POST","PUT","DELETE"],
    credential : true
    
}
const app = express()
connectDB()
app.use(express.json())
app.use(cors(corsOptions))
app.use('/api/task',taskRouter)

app.get('/',(req,res) => {
 res.send('Hello')
})

const PORT = process.env.PORT || 4000

app.listen(PORT,() => {
    console.log(`server listen or running http://localhost:${PORT}`);
    
})