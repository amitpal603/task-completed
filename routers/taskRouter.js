const express = require('express')
const router = express.Router()
const {createTask,getTask,deleteTask,updateTask} = require('../controllers/taskController')


router.post('/create',createTask)
router.get('/get',getTask)
router.delete('/delete/:id',deleteTask)
router.put('/update/:id',updateTask)

module.exports = router