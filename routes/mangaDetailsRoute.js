const express = require('express');
const router = express.Router();
const MangaDetails = require('./models/mangaDetails');

// Route to add manga details to the database
router.post('/add', async (req, res) => {
    try {
        const { title, author, demographic, genre } = req.body;
        
        // Create a new manga details document
        const newManga = new MangaDetails({
            title,
            author,
            demographic,
            genre
        });

        // Save the new manga details document to the database
        const savedManga = await newManga.save();

        res.status(201).json(savedManga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
