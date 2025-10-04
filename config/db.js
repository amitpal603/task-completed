const mongoose = require('mongoose')

const connectDB = async() => {
    try {
        mongoose.connect(process.env.MONGODB_URI)
        console.log(' Database connected successFully.. ');
        
    } catch (error) {
        console.log(error.message);
        
    }
}
module.exports = connectDB