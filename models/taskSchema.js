const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required : true
    },
    description:{
        type:String,
        required:true
    },
    complete:{
        type:Boolean,
        default : false
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    dueDate : {
        type:Date
    }
    
},{timeseries:true})

taskSchema.index({user : 1} , {createdAt : -1})
taskSchema.index({user : 1} , {completed : 1})

const Task = mongoose.model("Task",taskSchema)

module.exports = Task