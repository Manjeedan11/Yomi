const express = require('express');
const router = express.Router();
const { mangaSchema } = require("../models/mangaDetails");
const MangaDetails = require("../models/mangaDetails");

const isAdmin = (req, res, next) => {
    try{
    if (req.session.userRole !== 'admin') {
        return res.status(403).send({ message: "Access Forbidden: Not an admin" });
        next(); 
    }
    }
    catch (error) {
        console.error(error);
        res.status(403).json({ message: "Access Forbidden: Not an admin" });
    }
    
};


// Admin - Add Details
router.post('/', async (req, res) => {
    try {
        const { title, author, demographic, genre, image, description } = req.body;
        
        
        const newManga = new MangaDetails({
            title,
            author,
            demographic,
            genre,
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
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, author, demographic, genre, image, description } = req.body;
        console.log(id);
        
        
        let manga = await MangaDetails.findById(id);
        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        manga.title = title;
        manga.author = author;
        manga.demographic = demographic;
        manga.genre = genre;
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
router.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        console.log(title);
        
        const manga = await MangaDetails.findOne({ title: title });

        if (!manga) {
            return res.status(404).json({ message: "Manga not found" });
        }

        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Users - Get Details by Id
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        
        const manga = await MangaDetails.findById(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//Users - get all manga
router.get('/', async (req, res) => {
    try {
        
        const manga = await MangaDetails.find({});

        if (!manga) {
            return res.status(404).json({ message: "No Manga" });
        }

        res.json(manga);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
});


//Admin - DeleteDetails
router.delete('/:id', isAdmin, async (req, res) =>{
    try {
        const id = req.params.id;
        
        const manga = await MangaDetails.findByIdAndDelete(id);

        if (!manga) {
            return res.status(404).json({ message: "Manga details not found" });
        }

        res.json(manga);
    } catch (error) {
        res.status(500).json({message: "Unable to delete manga"})
    }
})

module.exports = router;
