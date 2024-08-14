const express = require('express')
const router = express.Router();
const { Register, Login } = require('../Controllers/UserAuthController');
const UserModel = require('../Models/UserModel');
const Protected = require('../Middleware/Protected');
const Classroom = require('../Models/Classroom');

router.post('/register', Register)

router.post('/login', Login)

router.put('/updateuser/:id', Protected, async (req, res) => {
    const { Name, Email, Role, ClassroomId, Password } = req.body;
    const userId = req.params.id;
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        if (Role === 'Teacher' || user.Role === 'Teacher') {
            if (!Role) {
                const Role = user.Role;
                const existingTeacher = await UserModel.findOne({ Role: 'Teacher', ClassroomId });
                if (existingTeacher && existingTeacher._id.toString() !== userId) {
                    return res.status(400).json({ error: 'Classroom already assigned to another teacher' });
                }
                return (Role)
            }
            // Check if the role is changing to Teacher
            if (Role === 'Teacher') {
                // Ensure the ClassroomId is unique
                const existingTeacher = await UserModel.findOne({ Role: 'Teacher', ClassroomId });
                if (existingTeacher && existingTeacher._id.toString() !== userId) {
                    return res.status(400).json({ error: 'Classroom already assigned to another teacher' });
                }
            }
            const updatedUser = await UserModel.findByIdAndUpdate(userId, {
                Name,
                Email,
                Role,
                ClassroomId,
                Password
            }, { new: true })
                .then(() => {
                    if (Role === 'Teacher') {
                        Classroom.findByIdAndUpdate(ClassroomId, { TeacherId: userId })
                    }
                })

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            console.log(updatedUser)
            return res.status(200).json(updatedUser);
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            Name,
            Email,
            Role,
            ClassroomId,
            Password
        }, { new: true })
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(updatedUser)
        return res.status(200).json(updatedUser);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/deleteUser/:postId', Protected, async (req, res) => {
    try {
        const user = await UserModel.findOne({ _id: req.params.postId });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        await user.deleteOne()
        await Classroom.updateMany(
            { TeacherId: req.params.postId },
            { $unset: { TeacherId: "" } }
        );

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Error deleting post:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get("/alldata", Protected, (req, res) => {
    UserModel.find()
        .then((dbPosts) => {
            res.status(200).json({ dbPosts });
        })
        .catch((error) => {
            console.log(error);
        });
});

router.get("/alldata/:classid", Protected, (req, res) => {
    UserModel.find({ ClassroomId: req.params.classid })
        .then((dbPosts) => {
            res.status(200).json({ dbPosts });
        })
        .catch((error) => {
            console.log(error);
        });
});

module.exports = router