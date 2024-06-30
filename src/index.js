// const mongoose = require('mongoose')
// const {taskModel, userModel} = require('./db/mongoose.js') 


// const url = `mongodb://127.0.0.1:27017/task-manager`
// async function main(){

// await mongoose.connect(url);
// console.log(`Connected`); 

// const anotherTask = new taskModel({
//     description: "Bowled",
//     completed: true,
//     email: "hello@ok.com"
// })

// const newUser = new userModel({
//     name: "Rishu",
//     email:"hehehe@hoho.com",
//     age: 88,
//     password:'abcd1234'

// })

// const savetask2 = await anotherTask.save().catch((error)=>{
//     console.log(error);
// });

// const saveUser = await newUser.save().catch((error)=>{
//     console.log(`${error}`); 
// })

// console.log(`_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_`);
// const findres = await taskModel.find();
// const findUser = await userModel.find();
// console.log(findres);
// console.log(findUser);

// }

// main();
const express = require('express')
const userRouter = require('./routers/user.js')
const taskRouter = require('./routers/task.js')
require('./db/mongoose.js') 

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.listen(port,()=>{
    console.log(`process running on http://localhost:${port}`);
})


