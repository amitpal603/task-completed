const Task = require('../models/taskSchema')
const client = require('../config/redisConfig')

const createTask = async(req,res) => {
    const {title,description} = req.body
    const userId = req.session.user?.userId || req.userId
    try {
        const addTask = new Task({title,description,user : userId})
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
    const userId = req.session.user?.userId || req.userId
    const cacheValue = await client.get('todos');

    if (cacheValue) {
      console.log('✅ Fetched from Redis cache');
      return res.status(200).json({
        success: true,
        todo: JSON.parse(cacheValue),
        fromCache: true,
      });
    }

    const getTodo = await Task.find({userId});

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
   const userId = req.session.user?.userId || req.userId
    try {
        const deleteTask = await Task.findByIdAndDelete({id,user:userId})

        if(!deleteTask){
          return res.status(404).json({
            success:false,
            message: 'todo not found'
          })
        }
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
    const userId = req.session.user?.userId || req.userId
    try {
        const update = await Task.findByIdAndUpdate({id,user : userId},{$set: req.body},{new:true,runValidators : true})
          if(!update){
            return res.status(404).json({
              success:false,
              message:'Todo not found'
            })
          }
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
 const completeTask = async (req,res) => {
  try {
    const userId = req.session.user?.userId || req.userId
    const {id} = req.params
    const todo = await Task.findOne({id,user:userId})

    if(!todo){
      return res.json({
        success:false,
        message:"todo not found"
      })
    }

    todo.complete = !todo.complete
    await todo.save()

    res.json({
      success:true,
      message: `Todo marked as ${todo.complete ? 'complete' :'incomplete'}`,
      todo
    })
  } catch (error) {
    res.status(500).json({
      success:false,
      message:'error updating todo'
    })
  }
 }
module.exports = {createTask,getTask,deleteTask,updateTask,completeTask}