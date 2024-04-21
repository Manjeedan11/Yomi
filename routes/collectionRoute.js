const router = require("express").Router();
const { User } = require("../models/user");
const { mangaId } = require("../models/mangaDetails");

router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Accessing userId from session
        const mangaId = req.body.mangaId;

        if (!userId || !mangaId)
            return res.status(400).send({ message: "User ID and Manga ID are required" });

        let user = await User.findById(userId);

        if (!user)
            return res.status(404).send({ message: "User not found" });

        if (!user.collection)
            user.collection = [];

        if (!user.collection.includes(mangaId))
            user.collection.push(mangaId);

        await user.save();

        res.status(200).send({ message: "Manga added to collection successfully" });
    } catch (error) {
        //console.error("Error adding manga to collection:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

router.delete('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Accessing userId from session
        const mangaId = req.body.mangaId;

        if (!userId || !mangaId)
            return res.status(400).send({ message: "User ID and Manga ID are required" });

        let user = await User.findById(userId);

        if (!user)
            return res.status(404).send({ message: "User not found" });

        if (!user.collection)
            user.collection = [];

        const index = user.collection.indexOf(mangaId);
        if (index !== -1) {
            user.collection.splice(index, 1);
            await user.save();
            res.status(200).send({ message: "Manga removed from collection successfully" });
        } else {
            res.status(404).send({ message: "Manga not found in user's collection" });
        }
    } catch (error) {
        //console.error("Error removing manga from collection:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;