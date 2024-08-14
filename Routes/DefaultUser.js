const mongoose = require('mongoose');
const UserModel = require('../Models/UserModel'); // Import your UserModel
const bcryptjs = require("bcryptjs");


// Default user details
const defaultUser = {
    Name: 'Admin ',
    Email: 'principal@classroom.com',
    Password: 'Admin', // Make sure to hash this password in a real scenario
    Role: 'Principal', // or any other role you want to assign
    ClassroomId: null
};

// Function to ensure default user exists
const ensureDefaultUser = async () => {
    try {
        const user = await UserModel.findOne({ Email: defaultUser.Email });

        if (!user) {
            console.log('Default user not found. Creating default user...');
            const hashedPassword = await bcryptjs.hash(defaultUser.Password, 8); // Hash the default password

            await UserModel.create({
                ...defaultUser,
                Password: hashedPassword
            });

            console.log('Default user created successfully.');
        } else {
            console.log('Default user already exists.');
        }
    } catch (error) {
        console.error('Error ensuring default user:', error);
    }
};

// Export the function to be used in your app initialization
module.exports = ensureDefaultUser;
