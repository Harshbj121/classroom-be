const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const UserRoutes = require('./Routes/UserRoutes')
const ClassroomRoutes = require('./Routes/ClassroomRoutes')
const MONGODB_URI= `mongodb+srv://harshbj121:CUw6nKspkusFr2je@classroom.6tcxj.mongodb.net/?retryWrites=true&w=majority&appName=Classroom`
const defaultUser = require('./Routes/DefaultUser')

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(cors());
app.use(express.json());

defaultUser();

app.use("/auth", UserRoutes);
app.use("/api", ClassroomRoutes);

app.listen(5000, () => {
    console.log('Server running on 5000')
})