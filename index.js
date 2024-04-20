require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connection = require('./db');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const mangaDetailsRoute = require('./routes/mangaDetailsRoute');
const collection = require('./routes/collectionRoute');
const admin = require('./routes/admin');
const session = require('express-session');
const cookieParser = require('cookie-parser');

connection();

app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true,
    })
);

app.use(cookieParser());


// Configure express-session middleware
app.use(session({
    key: "userId",
    secret: 'hatsune miku',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,
    }
}));

// Mount your routes after configuring session middleware
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/manga", mangaDetailsRoute);
app.use("/manga/:id", mangaDetailsRoute);
app.use("/collections/", collection);
app.use("/collections/:id", collection);
app.use("/admin", admin);

// Root route handler for testing session
app.get('/', (req, res) => {
    const sessionData = req.session;

    return res.status(200).json({ sessionData });
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome to Manga Discovery');
});
