const express = require('express');
const router = express.Router();
const { Collection } = require("../models/collection");
const { MangaDetails } = require("../models/mangaDetails");
const { mangaSchema } = require("../models/mangaDetails");

// Add manga details to collection
router.post('/:id', async (req, res) => {
    try {
        const mangaId = req.params.id;

        // Check if manga details exist
        const manga = await MangaDetails.findById(mangaId);
        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        // Create a new collection item
        const newCollectionItem = new Collection({
            mangaId: manga._id,
            title: manga.title,
            author: manga.author,
            demographic: manga.demographic,
            genre: manga.genre,
            synopsis: manga.synopsis,
            image: manga.image,
            description: manga.description
        });

        // Save the new collection item
        await newCollectionItem.save();

        res.json({ message: "Manga added to collection successfully", mangaDetails: manga });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
