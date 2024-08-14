const mongoose = require('mongoose');

const TimetableSchema = new mongoose.Schema({
    ClassroomId: { type: mongoose.Schema.Types.ObjectId, ref: 'Classroom', required: true },
    Subject: { type: String, required: true },
    Day: { type: String, required: true }, // e.g., "Monday"
    StartTime: { type: String, required: true },
    EndTime: { type: String, required: true }
});

// Ensure periods are within the classroom's start and end times
TimetableSchema.pre('save', async function(next) {
    const classroom = await mongoose.model('Classroom').findById(this.ClassroomId);
    if (!classroom) {
        return next(new Error('Classroom not found'));
    }
    if (!classroom.Days.includes(this.Day)) {
        return next(new Error('Day is not within classroom schedule'));
    }
    // Check if start and end times are within classroom times
    if (this.StartTime < classroom.StartTime || this.EndTime > classroom.EndTime) {
        return next(new Error('Timetable period is outside classroom hours'));
    }
    next();
});

const Timetable = mongoose.model('Timetable', TimetableSchema);

module.exports = Timetable;
