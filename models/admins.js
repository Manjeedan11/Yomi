const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require("crypto");

const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 16; 
const HASH_ITERATIONS = parseInt(process.env.HASH_ITERATIONS) || 10000; 
const HASH_KEY_LENGTH = parseInt(process.env.HASH_KEY_LENGTH) || 64; 
const HASH_ALGORITHM = process.env.HASH_ALGORITHM || 'sha512'; 

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    }
    // You can add more admin-specific fields here if needed
});

const Admin = mongoose.model("Admin", adminSchema);

const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
};


const createAdmin = async (userData) => {
    try {
        const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
        const hashedPassword = hashPassword(userData.password, salt);

        const user = new Admin({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            salt: salt 
        });

        await user.save();

        console.log("User created successfully");
        return user;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }
};




module.exports = {Admin, createAdmin};
