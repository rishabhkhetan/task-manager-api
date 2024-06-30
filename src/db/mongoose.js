// const mongoose = require('mongoose');

// // const dbname = 'my-task-manager';

// // const url = `mongodb://127.0.0.1:27017/${dbname}`

// // mongoose.connect(url);

// const taskSchema = mongoose.Schema({
//     description:{type: String, required: true, default: "Empty Task"},
//     completed:{type: Boolean, required: true, default: false},
// })

// const taskModel = mongoose.model('Task',taskSchema)

// module.exports = taskModel;


const mongoose = require('mongoose')
const mongooseURL = process.env.MONGODB_URL
// const validator = require('validator')
async function main(){
const url = `${mongooseURL}`;
await mongoose.connect(url);
}

main().catch((error)=>{
    console.log(error)
})
