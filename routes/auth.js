require('dotenv').config(); 
const router = require("express").Router();
const { User } = require("../models/user");
const Joi = require("joi");
const crypto = require("crypto");
const session = require ('express-session');
const bcrypt = require('bcrypt');

const HASH_ITERATIONS = parseInt(process.env.HASH_ITERATIONS) || 10000; 
const HASH_KEY_LENGTH = parseInt(process.env.HASH_KEY_LENGTH) || 64; 
const HASH_ALGORITHM = process.env.HASH_ALGORITHM || 'sha512'; 

router.use(session({
    secret: 'hatsune miku',
    genSid: function(req){
        return crypto.randomBytes(32).toString('hex');
    },
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: true
    } , //set to expire after an hour
    resave: false,
    saveUninitialized: false
}))

router.post("/", async (req, res) => {
    try {
        // Sanitize 
        const { email, password } = req.body;
        const sanitizedEmail = xss(email);
        const sanitizedPassword = xss(password);

        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        console.log("Looking up the user");
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) {
            console.log("User not found");
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        console.log("validating password");
        if (!user.salt || !user.password) {
            console.error("Salt or hashed password not found for the user");
            return res.status(500).send({ message: "Salt or hashed password not found for the user" });
        }

        const passwordMatch = validatePassword(sanitizedPassword, user.salt, user.password);
        if (!passwordMatch) {
            console.log("Invalid password");
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        //here the session variables are set
        req.session.userId = user._id;
        req.session.userRole = 'user';

        console.log("Password validated, generating token");
        const token = generateAuthToken(user._id);
        res.status(200).send({ data: token, message: "Logged in successfully" });

    } catch (error) {
        console.error("Error during authentication:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

    

const validate = (data) => {
    // Sanitize input data to prevent XSS attacks
    const sanitizedData = {
        email: xss(data.email),
        password: xss(data.password)
    };

    const schema = Joi.object({
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().label("Email")
            .messages({
                'string.email': 'Invalid email format',
                'string.empty': 'Email is required'
            }),
        password: Joi.string().length(8).required().label("Password")
            .messages({
                'string.length': 'Password must be minimum 8 characters long',
            }),
    });
    return schema.validate(sanitizedData);
}

async function validatePassword(password, hashedPassword) {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    } catch (error) {
        console.error('Error validating password:', error);
        return false;
    }
}

function generateAuthToken(userId) {
    // Function defined to generate token (JSON format) if the login credentials are correct for testing purposes
}

module.exports = router;
