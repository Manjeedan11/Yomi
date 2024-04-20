require('dotenv').config();
const express = require('express');
const app = express();
const cors = require("cors");
const connection = require("./db");
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const mangaDetailsRoute = require('./routes/mangaDetailsRoute');
const collection = require('./routes/collectionRoute')
const admin = require("./routes/admin");

connection();

app.use(express.json())
app.use(cors());

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/manga", mangaDetailsRoute);
app.use("/manga/:id", mangaDetailsRoute);
app.use("/collections/", collection);
app.use("/admin", admin);


const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`))

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to Manga Discovery')
    });