const express = require('express')
const router = express.Router();
const Classroom = require('../Models/Classroom');
const protected = require('../Middleware/Protected');
const UserModel = require('../Models/UserModel');

router.post('/createclassroom', async (req, res) => {
    const { Name, StartTime, EndTime, Day, TeacherId } = req.body;
    if (!Name || !StartTime || !EndTime || !Day) {
        return res.status(400).json({ error: "One or more field missing" });
    }

    Classroom.findOne({ Name: Name })
        .then((Class) => {
            if (Class) {
                return res.status(500).json({ error: "Class already exist" });
            }
            const newClass = new Classroom({ Name, StartTime, EndTime, Day, TeacherId: TeacherId || null });
            newClass.save()
                .then(async (newClass) => {
                    if (TeacherId) {
                        // Find and update the teacher's ClassroomId
                        const teacher = await UserModel.findByIdAndUpdate(
                            TeacherId,
                            { ClassroomId: newClass._id },
                            { new: true }
                        );

                        if (!teacher) {
                            return res.status(404).json({ error: "Teacher not found" });
                        }
                    }
                    res.status(201).json({ result: 'Class created Successfully' })
                })
                .catch((err) => {
                    console.log(err);
                })
        })
        .catch((err) => {
            console.log(err)
        })
})

router.get('/data', protected, (req, res) => {

})

module.exports = router 