const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true, unique: true },
    Password: { type: String, required: true },
    Role:{type: String,enum: ['Principal','Student','Teacher'], required: true},
    ClassroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }
});
const UserModel = mongoose.model('UserModel' , UserSchema)

module.exports = UserModel 