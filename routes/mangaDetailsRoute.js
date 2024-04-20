const express = require('express');
const router = express.Router();
const { mangaSchema } = require("../models/mangaDetails");
const MangaDetails = require("../models/mangaDetails");

// Admin - Add Details
router.post('/', async (req, res) => {
    try {
        const { title, author, demographic, genre, synopsis, image, description } = req.body;
        
        
        const newManga = new MangaDetails({
            title,
            author,
            demographic,
            genre,
            synopsis,
            image,
            description
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

// Admin - UpdateDetails
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, demographic, genre, synopsis, image, description } = req.body;
        
        
        let manga = await MangaDetails.findById(id);
        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        manga.title = title;
        manga.author = author;
        manga.demographic = demographic;
        manga.genre = genre;
        manga.synopsis = synopsis;
        manga.image = image;
        manga.description = description;

        const updatedManga = await manga.save();

        res.json(updatedManga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Users - SearchDetails
router.get('/:title', async (req, res) => {
    try {
        const title = req.params.title;
        
        const manga = await MangaDetails.findOne({ title: title });

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//delete manga
router.delete('/:title', async (req, res) =>{
    try {
        const title = req.params.title;
        
        const manga = await MangaDetails.findOneAndDelete({ title: title });

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (error) {
        res.status(500).json({message: "Unable to delete manga"})
    }
})


module.exports = router;
