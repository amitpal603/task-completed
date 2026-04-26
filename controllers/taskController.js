const Task = require('../models/taskSchema')
const { cache } = require('../config/redisConfig')

const createTask = async(req,res) => {
    const {title,description} = req.body
    const userId = req.session.user?.userId || req.userId
    try {
        const addTask = new Task({title,description,user : userId})
        await addTask.save()

        // Invalidate cache
        await cache.del(`todos:${userId}`);

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
    const cacheKey = `todos:${userId}`;
    const cacheData = await cache.get(cacheKey);

    if (cacheData) {
      console.log(`✅ Fetched from Redis cache for user: ${userId}`);
      return res.status(200).json({
        success: true,
        todo: cacheData,
        fromCache: true,
      });
    }

    const getTodo = await Task.find({ user: userId });

    if (!getTodo || getTodo.length === 0) {
      return res.status(200).json({ success: true, todo: [] });
    }

    // Cache for 1 hour
    await cache.set(cacheKey, getTodo, 3600);

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
        const deleteTask = await Task.findOneAndDelete({ _id: id, user: userId })

        if(!deleteTask){
          return res.status(404).json({
            success:false,
            message: 'todo not found'
          })
        }

        // Invalidate cache
        await cache.del(`todos:${userId}`);

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
        const update = await Task.findOneAndUpdate({ _id: id, user: userId }, { $set: req.body }, { new: true, runValidators: true })
          if(!update){
            return res.status(404).json({
              success:false,
              message:'Todo not found'
            })
          }

        // Invalidate cache
        await cache.del(`todos:${userId}`);

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
    const todo = await Task.findOne({ _id: id, user: userId })

    if(!todo){
      return res.json({
        success:false,
        message:"todo not found"
      })
    }

    todo.complete = !todo.complete
    await todo.save()

    // Invalidate cache
    await cache.del(`todos:${userId}`);

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