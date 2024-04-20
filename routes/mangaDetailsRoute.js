const express = require('express');
const router = express.Router();
const { mangaSchema } = require("../models/mangaDetails");
const MangaDetails = require("../models/mangaDetails");


router.post('/', async (req, res) => {
    try {
        const { title, author, demographic, genre, synopsis } = req.body;
        
        
        const newManga = new MangaDetails({
            title,
            author,
            demographic,
            genre,
            synopsis
        });

        const savedManga = await newManga.save();

        res.status(201).json(savedManga);
    } catch (err) {
        console.error(err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ message: err.message });
        }
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
