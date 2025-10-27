const Task = require('../models/taskSchema')
const client = require('../config/redisConfig')

const createTask = async(req,res) => {
    const {title,description} = req.body

    try {
        const addTask = new Task({title,description})
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


const getTask = async (req, res) => {
  try {
    const cacheValue = await client.get('todos');

    if (cacheValue) {
      console.log('✅ Fetched from Redis cache');
      return res.status(200).json({
        success: true,
        todo: JSON.parse(cacheValue),
        fromCache: true,
      });
    }

    const getTodo = await Task.find({});

    if (!getTodo || getTodo.length === 0) {
      return res.status(200).json({ success: true, todo: [] });
    }

    await client.set('todos', JSON.stringify(getTodo), 'EX', 60);

    return res.status(200).json({
      success: true,
      todo: getTodo,
      fromCache: false,
    });
  } catch (error) {
    console.error('Redis or DB Error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
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
    const {title,description,complete} = req.body
    try {
        const update = await Task.findByIdAndUpdate(id,{title,description,complete},{new:true})

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