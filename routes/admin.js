const express = require('express');
const router = express.Router();
const { Admin, createAdmin } = require("../models/admins");
const Joi = require("joi");
const crypto = require("crypto");
const session = require ('express-session');

const SALT_LENGTH = parseInt(process.env.SALT_LENGTH) || 16; 
const HASH_ITERATIONS = parseInt(process.env.HASH_ITERATIONS) || 10000; 
const HASH_KEY_LENGTH = parseInt(process.env.HASH_KEY_LENGTH) || 64; 
const HASH_ALGORITHM = process.env.HASH_ALGORITHM || 'sha512'; 

const isAdmin = (req, res, next) => {
    if (req.session.userRole !== 'admin') {
        return res.status(403).send({ message: "Access Forbidden: Not an admin" });
    }
    next(); // Allow the request to proceed to the next middleware or route handler
};


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

//creates an admin
router.post("/", async (req, res) => {
    try {
        console.log("Creating a new admin");


        const userData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        const createdUser = await createAdmin(userData); 

        console.log("User created successfully");
        console.log("Looking up the created user in the database");
        const foundUser = await Admin.findById(createdUser._id); 
        console.log("User found in the database:", foundUser);


        res.status(201).send({ message: "Admin created successfully" });
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.message === 'User already exists with the same username or email') {
            return res.status(400).send({ message: error.message });
        }
        res.status(500).send({ message: "Internal Server Error" });
    }
});


// I believe this creates an admin

router.post("/login", async (req, res) => {
    try {
        // sanitizing
        const { email, password } = req.body;
        const sanitizedEmail = xss(email);
        const sanitizedPassword = xss(password);

        const { error } = validate(req.body);
        if (error)
            return res.status(400).send({ message: error.details[0].message });

        const admin = await Admin.findOne({ email: sanitizedEmail });
        if (!admin) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        if (!admin.password) {
            return res.status(500).send({ message: "Password not found for the admin" });
        }

        const passwordMatch = validatePassword(sanitizedPassword, admin.password);
        if (!passwordMatch) {
            return res.status(401).send({ message: "Invalid Email or Password" });
        }

        //session variable for Admins
        req.session.adminId = admin._id;
        req.session.isLoggedIn = true;
        req.session.userRole = 'admin';

       
        const token = generateAuthToken(admin._id);
        res.status(200).send({ data: token, message: "Logged in successfully" });
    } catch (error) {
        console.error("Error during admin authentication:", error);
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
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password")
    });
    return schema.validate(sanitizedData);
}

function validatePassword(password, salt, hashedPassword) {
    const hashedInputPassword = crypto.pbkdf2Sync(password, Buffer.from(salt, 'hex'), HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_ALGORITHM).toString('hex');
    console.log("hashed inpt: ", hashedInputPassword);
    console.log("hashed pass:", hashedPassword);
    return hashedInputPassword === hashedPassword;
}

function generateAuthToken(adminId) {
   
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
