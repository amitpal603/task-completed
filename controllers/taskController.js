const Task = require('../models/taskSchema')

const createTask = async(req,res) => {
    const {title,description} = req.body

    try {
        const addTask = new Task({title,description,complete:false})
        await addTask.save()

        return res.status(201).json({
            success:true,
            message:'create new task'
        })
    } catch (error) {
        return res.status(500).json({
            message:`${error.message}`
        })
    }
}

const getTask = async(req,res) => {
    try {
        const getTodo = await Task.find({})

        if(!getTodo && getTodo.length == 0){
            res.json({
                success:true,
                todo: []
            })
        }

        return res.status(200).json({
            success:true,
            todo:getTodo
        })
    } catch (error) {
         return res.status(500).json({
            message:`${error.message}`
        })
    }
}

const deleteTask = async(req,res) => {
    const {id} = req.params

    try {
        const deleteTask = await Task.findByIdAndDelete(id)
        return res.status(200).json({
            success:true,
            message:'deleted successfULLY'
        }) 
    } catch (error) {
         return res.status(500).json({
            message:`${error.message}`
        })
    }
}

const updateTask = async(req,res) => {
    const {id} = req.params
    const {title,description} = req.body
    try {
        const update = await Task.findByIdAndUpdate(id,{title,description},{new:true})

        return res.status(200).json({
            success:true,
            message:'update successFully'
        })
    } catch (error) {
         return res.status(500).json({
            message:`${error.message}`
        })
    }
}

module.exports = {createTask,getTask,deleteTask,updateTask}