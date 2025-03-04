require('dotenv').config(); 
const router = require("express").Router();
const session = require ('express-session');
const { User, createUser } = require("../models/user");
const Joi = require("joi");
const crypto = require("crypto");
const xss = require('xss');


const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 16; 
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
        // Sanitize user inputs to prevent XSS attacks
        const { username, email, password } = req.body;
        const sanitizedUsername = xss(username);
        const sanitizedEmail = xss(email);
        const sanitizedPassword = xss(password);

        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        //console.log("Creating a new user");


        const userData = {
            username: sanitizedUsername,
            email: sanitizedEmail,
            password: sanitizedPassword
        };

        // Create the user
        const createdUser = await createUser(userData); 

        //console.log("User created successfully");
        const foundUser = await User.findById(createdUser._id); 
        // Set session variables
        req.session.userId = foundUser._id;
        req.session.isLoggedIn = true;
        req.session.userRole = 'user';
        res.status(201).send({ message: "User created successfully" });
        
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.message === 'User already exists with the same username or email') {
            return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: "Internal Server Error" });
    }
});

const validate = (data) => {
    const schema = Joi.object({
        username: Joi.string().regex(/^[a-zA-Z0-9_]{3,30}$/).required().label("Username")
            .messages({
                'string.pattern.base': 'Username must contain only letters, numbers, and underscores and be between 3 to 30 characters long'
            }),
        email: Joi.string().email({ minDomainSegments: 2 }).required().label("Email")
            .messages({
                'string.email': 'Invalid email format',
                'string.empty': 'Email is required'
            }), 
        password: Joi.string().min(8).required().label("Password")
            .messages({
                'string.min': 'Password must be minimum 8 characters long',
            }),
    });
    return schema.validate(data);
}

function hashPassword(password, salt) {
    return crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
}

router.get('/logout', (req, res) => {
    req.session.destroy(err =>{
        if (err){
            console.log(err)
        } else{
            res.clearCookie('connect.sid');
            res.redirect('/')
        }
    });
});

module.exports = router;
