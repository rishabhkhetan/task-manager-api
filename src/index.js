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

const app = require('./app.js')
const port = process.env.PORT

app.listen(port,()=>{
    console.log(`process running on http://localhost:${port}`);
})


