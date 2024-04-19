const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const passwordComplexity = require("joi-password-complexity");
const crypto = require("crypto");


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
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
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"), 
    password: passwordComplexity().required().label("Password"),
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
            firstName: userData.firstName,
            lastName: userData.lastName,
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
