require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors')
const UserRoutes = require('./Routes/UserRoutes')
const ClassroomRoutes = require('./Routes/ClassroomRoutes')
const MONGODB_URI= process.env.MONGODB_URI
const PORT = process.env.PORT
const defaultUser = require('./Routes/DefaultUser')

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
    defaultUser();
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.use(cors());
app.use(express.json());
app.get('/test', (req,res)=>{
    res.send("Hello World")
})


app.use("/auth", UserRoutes);
app.use("/api", ClassroomRoutes);

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})