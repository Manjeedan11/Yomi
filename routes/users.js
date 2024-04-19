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
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
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
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

function generateSaltAndHash(password) {
    const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
    return { salt, hashedPassword };
}

module.exports = router;
