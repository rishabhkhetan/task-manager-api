const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.js')

const Task = require('../models/task.js')

router.post('/tasks',auth,async (req,res)=>{

    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save();
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
//GET /tasks?completed=true
//GET /tasks?Limit=10&skip=20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async (req,res)=>{
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try{

    //const tasks =await Task.find({owner:req.user._id})
    await req.user.populate({
        path:'tasks',
        // match:{
        //     completed: true
        // }
        match,
        options:{
            limit: parseInt(req.query.limit),
            skip:parseInt(req.query.skip),
            sort
        }
    })
    res.send(req.user.tasks)

    }catch(e){
        res.status(500).send(e)
    }
})

router.get('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id;

    try {
        const task = await Task.findOne({_id, 'owner': req.user._id})
        
        if(!task)
            return res.status(404).send("Task does not exist")

        res.send(task)  
    } catch (error) {
        res.status(404).send(error)
    }
})

router.patch('/tasks/:id',auth, async (req,res)=>{
    const _id = req.params.id;
    const updatesrequested = Object.keys(req.body) 

    const allowedUpdates = ['description', 'completed']

    const isValidUpdate = updatesrequested.every((item)=>{
        return allowedUpdates.includes(item)
    })

    if(!isValidUpdate)
        return res.status(400).send("Invalid Updates")

    try {
            const task = await Task.findOne({_id, owner: req.user._id})

        // const updateresult = await  Task.findByIdAndUpdate(_id,req.body,{new: true, runValidators: true})
        if(!task)
            return res.status(400).send("Unsuccessful")
       
        updatesrequested.forEach((update)=>{
            task[update] = req.body[update]
        })

        await task.save()
        res.send(task);
    } catch (error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id',auth,async (req,res)=>{
    const _id = req.params.id;
    try{
    const deletedtask = await Task.findOneAndDelete({_id, owner: req.user._id})
    if(!deletedtask)
        return res.status(404).send("Task to delete not found")
    res.send(deletedtask)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router