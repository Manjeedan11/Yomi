const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String, 
        required: true
    },
    salt: {
        type: String,
        required: true
    }
});

userSchema.methods.generateAuthToken = function(){
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
    password: passwordComplexity().required().label("Password"),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm Password')
        .messages({
            'any.only': 'Passwords must match',
            'any.required': 'Confirm password is required'
        })
   });
   return schema.validate(data);
};

const hashPassword = (password, salt) => {
    return crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 10000, 64, 'sha512').toString('hex');
};

const createUser = async (userData) => {
    try {
        
        const { error } = validate(userData);
        if (error) {
            throw new Error(error.details[0].message);
        }

        
        const salt = crypto.randomBytes(16).toString('hex');

        
        const hashedPassword = hashPassword(userData.password, salt);

        
        const user = new User({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            confirmPassword: userData.confirmPassword, 
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
