const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const crypto = require("crypto");

const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 16; 
const HASH_ITERATIONS = parseInt(process.env.HASH_ITERATIONS) || 10000; 
const HASH_KEY_LENGTH = parseInt(process.env.HASH_KEY_LENGTH) || 64; 
const HASH_ALGORITHM = process.env.HASH_ALGORITHM || 'sha512'; 

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    collections: {
        type: [String],
        
    }
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWTPRIVATEKEY, {expiresIn: "7d"}); 
    return token;
};

const User = mongoose.model("User", userSchema);

const validate = (data) => {
   const schema = Joi.object({
    username: Joi.string().regex(/^[a-zA-Z0-9_]{3,30}$/).required().label("Username")
        .messages({
            'string.pattern.base': 'Username must contain only letters, numbers, and underscores and be between 3 to 30 characters long'
        }),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().label("Email")
        .messages({
            'string.email': 'Invalid email format',
            'string.empty': 'Email is required'
        }), 
    password: Joi.string().min(8).required().label("Password")
        .messages({
            'string.min': 'Password must be minimum 8 characters long',
        })
   });
   return schema.validate(data);
};

const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
};


const createUser = async (userData) => {
    try {
        const { error } = validate(userData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email: userData.email }, { username: userData.username }] });
        if (existingUser) {
            throw new Error('User already exists with the same username or email');
        }

        const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
        const hashedPassword = hashPassword(userData.password, salt);

        const user = new User({
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

module.exports = { User, createUser };
