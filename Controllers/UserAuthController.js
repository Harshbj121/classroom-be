const UserModel = require("../Models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = 'classroom001';

const Register = async (req, res) => {
    const { Name, Email, Password, Role, ClassroomId } = req.body;
    if (!Name || !Email || !Role || !Password) {
        return res.status(400).json({ error: "One or more field missing" });
    }
    if (Role === 'Teacher' && ClassroomId) {
        // Ensure teachers have unique classroom IDs
        const existingTeacher = await UserModel.findOne({ Role: 'Teacher', ClassroomId: req.body.ClassroomId });
        if (existingTeacher) {
            return res.status(400).json({ error: 'Classroom already assigned to another teacher' });
        }
    }

    const existisingUser = await UserModel.findOne({ Email: Email });

    if (existisingUser) {
        return res
            .status(500)
            .json({ error: "User With this email already exist" });
    }

    try {
        const user = new UserModel({
            Name,
            Email,
            Password,
            Role,
            ClassroomId
        });
        user.Password = await bcryptjs.hash(Password, 8);
        const savedUser = await user.save();
        res.status(201).json({
            result: "User Added Successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ result: "Something went wrong" });
    }
};

const Login = async (req, res) => {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
        return res.status(400).json({ error: "One or more field missing" });
    }

    try {
        const userInDb = await UserModel.findOne({ Email: Email });
        if (!userInDb) {
            return res.status(401).json({ error: "No user Found" });
        }
        const passwordMatch = await bcryptjs.compare(Password, userInDb.Password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid Credentials" });
        }
        const jwtToken = jwt.sign({ _id: userInDb._id }, JWT_SECRET);
        res.status(201).json({
            result: {
                token: jwtToken,
                user: {
                    _id: userInDb._id,
                    Email,
                    Name: userInDb.Name,
                    Role: userInDb.Role,
                    ClassroomId: userInDb.ClassroomId
                }
            },
        });
    } catch (error) {
        console.log(error);
    }
};

module.exports = { Register, Login };