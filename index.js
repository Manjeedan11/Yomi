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
app.use("/collections/:id", collection);
app.use("/admin", admin);


<<<<<<< HEAD
const port = process.env.PORT || 6000;
=======
const port = process.env.PORT || 5000;
>>>>>>> 13aa944ab9e6f40834c247a145234420ed806acd
app.listen(port, () => console.log(`Listening on port ${port}`))

app.get('/', (request, response) => {
    console.log(request)
    return response.status(234).send('Welcome to Manga Discovery')
    });