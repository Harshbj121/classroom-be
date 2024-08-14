const mongoose = require('mongoose')

const ClassroomSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    StartTime: { type: String, required: true },
    EndTime: { type: String, required: true },
    Day: [{ type: String, required: true }],       // e.g., "Monday"
    TeacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher', unique: true , sparse: true}
});

const Classroom = mongoose.model('Classroom', ClassroomSchema);

module.exports = Classroom;