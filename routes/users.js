require('dotenv').config(); 
const router = require("express").Router();
const session = require ('express-session');
const { User, createUser } = require("../models/user");
const Joi = require("joi");
const crypto = require("crypto");

const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 16; 

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
    saveUnitialized: false
}))

router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        console.log("Creating a new user");

        const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
        const hashedPassword = hashPassword(req.body.password, salt);

        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };

        await createUser(userData);

        console.log("User created successfully");
        console.log("Looking up the created user in the database");
        const createdUser = await User.findById(user._id); 
        console.log("User found in the database:", createdUser);

        //here the session variables are set
        req.session.userId = user._id;
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
    return crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), 10000, 64, 'sha512').toString('hex');
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
