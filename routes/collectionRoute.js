const express = require('express');
const router = express.Router();
const { Collection } = require("../models/collection");
const { mangaSchema } = require("../models/mangaDetails");

//Add manga
router.post('/:id', async (req, res) => {
    try {
        const mangaId = req.params.id;

        // Check if manga details exist
        const manga = await mangaSchema.findById(mangaId);
        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }
        
        const newCollectionItem = new Collection({
            title: manga.title,
            author: manga.author,
            demographic: manga.demographic,
            genre: manga.genre,
            image: manga.image,
            description: manga.description
        });

        
        await newCollectionItem.save();

        res.json({ message: "Manga added to collection successfully", mangaDetails: manga });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete 
router.delete('/:id', async (req, res) => {
    try {
        const collectionItemId = req.params.id;

        const collectionItem = await Collection.findById(collectionItemId);
        if (!collectionItem) {
            return res.status(404).json({ message: "Collection item not found" });
        }
        await Collection.findByIdAndDelete(collectionItemId);

        res.json({ message: "Collection item deleted successfully", deletedItem: collectionItem });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
