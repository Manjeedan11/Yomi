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

        console.log("Looking up the user");
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.log("User not found");
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        console.log("User found, validating password");
        if (!user.salt || !user.password) {
            console.error("Salt or hashed password not found for the user");
            return res.status(500).send({ message: "Salt or hashed password not found for the user" });
        }

        const passwordMatch = validatePassword(req.body.password, user.salt, user.password);
        if (!passwordMatch) {
            console.log("Invalid password");
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        console.log("Password validated, generating token");
        const token = generateAuthToken(user._id);
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(data);
}

function validatePassword(password, salt, hashedPassword) {
    const hashedInputPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
    return hashedInputPassword === hashedPassword;
}

function generateAuthToken(userId) {
    // Generating and returning the authentication token to test whether we logged in
}

module.exports = router;
