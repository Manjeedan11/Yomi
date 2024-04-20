require('dotenv').config(); 
const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const crypto = require("crypto");

const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 16; 
const HASH_ITERATIONS = parseInt(process.env.HASH_ITERATIONS) || 10000; 
const HASH_KEY_LENGTH = parseInt(process.env.HASH_KEY_LENGTH) || 64; 
const HASH_ALGORITHM = process.env.HASH_ALGORITHM || 'sha512'; 

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        console.log("Creating a new user");
        const { salt, hashedPassword } = generateSaltAndHash(req.body.password);

        const user = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            confirmPassword: req.body.confirmPassword, 
            salt: salt
        });

        await user.save(); 

        console.log("User created successfully");
        console.log("Looking up the created user in the database");
        const createdUser = await User.findById(user._id); 
        console.log("User found in the database:", createdUser);

        res.status(201).send({ message: "User created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

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
        password: Joi.string().required().label("Password"),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().label('Confirm Password')
            .messages({
                'any.only': 'Passwords must match',
                'any.required': 'Confirm password is required'
            })
    });
    return schema.validate(data);
}

function generateSaltAndHash(password) {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
    return { salt, hashedPassword };
}

module.exports = router;
