const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const UserRoutes = require('./Routes/UserRoutes')
const ClassroomRoutes = require('./Routes/ClassroomRoutes')
const URL = 'mongodb://localhost:27017/classroom';
const defaultUser = require('./Routes/DefaultUser')

mongoose.connect(URL)
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