const mongoose = require('mongoose');
const UserModel = mongoose.model("UserModel");
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'classroom001';

module.exports = (req, res , next)=>{
    const {authorization} = req.headers ;
    if (!authorization){
        return res.status(401).json({error: "user not logged in"});
    }
    const token = authorization.replace("Bearer " , "");
    jwt.verify(token , JWT_SECRET, (error , payload)=>{
        if (error){
        return res.status(401).json({error: "user not logged in"});
        }
        const {_id} = payload;
        UserModel.findById(_id)
        .then((dbUser)=>{
            req.user = dbUser;
            next();
        })
    })
}