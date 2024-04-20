const express = require('express');
const router = express.Router();
const Admin = require("../models/admin");
const Joi = require("joi");
const crypto = require("crypto");
const session = require ('express-session');

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

function validatePassword(password, hashedPassword) {
   
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
