const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const jwtsecret = `${process.env.JWT_SECRET}`
const auth = async (req,res,next)=>{
    try {
        const token = req.header('Authorization').replace("Bearer ","")
        const decoded = jwt.verify(token, jwtsecret)
        const user = await User.findOne({_id: decoded._id, 'tokens.token':token})
        if(!user)
            throw new Error()

        req.token = token;
        req.user = user;
        next()

        
    } catch (error) {
        res.status(401).send({"error": "Please authenticate"})
    }
}

module.exports = auth