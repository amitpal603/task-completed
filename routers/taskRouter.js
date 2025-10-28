const express = require('express')
const router = express.Router()
const {createTask,getTask,deleteTask,updateTask,completeTask} = require('../controllers/taskController')

// todos routers all 
router.post('/create',createTask)
router.get('/get',getTask)
router.delete('/delete/:id',deleteTask)
router.put('/update/:id',updateTask)
router.patch('/:id/toggle',completeTask)


module.exports = router