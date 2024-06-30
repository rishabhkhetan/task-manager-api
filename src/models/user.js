const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task.js')



const userSchema = mongoose.Schema({
    name:{type: String, required:true, trim:true},
    email:{type:String, required:true, trim:true, lowercase: true, unique: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Bad Email")
            }
        }
    },
    age:{type: Number, default:0},
    password: {type: String, required: true, trim:true, minlength: 7,
        validate(value){
            if(validator.contains(value,'password',{ignoreCase:true})){
                throw new Error("Password cannot contain the word password")
            }
        }  
    },
    tokens: [{
        token: {type: String, require: true}
    }],
    avatar:{
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await userModel.findOne({email})

    if(!user){
        throw new Error("Unable to Login")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch)
        throw new Error("Unable To Login")

    return user;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const jwtsecret = `${process.env.JWT_SECRET}`
    const token = jwt.sign({_id: user._id.toString()}, jwtsecret)
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

userSchema.methods.toJSON = function () {
    const user = this 
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject;
}

userSchema.pre('save',async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next();

})

//Delete task when user is deleted 
userSchema.methods.deleteAllTasksAndUser = async function (){
    const user = this
    await Task.deleteMany({owner: user._id})
    await user.deleteOne()
}

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField:'owner'
})

const userModel = mongoose.model('User', userSchema)

module.exports = userModel;