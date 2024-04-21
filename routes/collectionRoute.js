const router = require("express").Router();
const { User } = require("../models/user");
const { mangaId } = require("../models/mangaDetails");
const session = require ('express-session');

router.use(session({
    secret: 'hatsune miku',
    genSid: function(req){
        return crypto.randomBytes(32).toString('hex');
    },
    cookie: {
        maxAge: 1000 * 60 * 60,
        httpOnly: true,
        secure: true
    } , //set to expire after an hour
    resave: false,
    saveUninitialized: false
}))

router.post('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Accessing userId from session
        const mangaId = req.body.mangaId;

        if (!userId || !mangaId)
            return res.status(400).send({ message: "User ID and Manga ID are required" });

        let user = await User.findById(userId);

        if (!user)
            return res.status(404).send({ message: "User not found" });

        if (!user.collections)
            user.collections = [];

        console.log("collection: ",user.collections);

        if (!user.collections.includes(mangaId))
            user.collections.push(mangaId);

        await user.save();

        res.status(200).send({ message: "Manga added to collection successfully" });
    } catch (error) {
        console.error("Error adding manga to collection:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});


router.get('/', async (req, res) => {
    try {
        const userId = req.session.userId; // Accessing userId from session
        console.log(userId);
        if (!userId)
            return res.status(400).send({ message: "User ID required" });

        let user = await User.findById(userId);
        console.log(user);

        if (!user)
            return res.status(404).send({ message: "User not found" });

        if (!user.collections)
            user.collections = [];

        console.log("collection: ",user.collections);

        res.status(200).send(user.collections);
    } catch (error) {
        console.error("Error adding manga to collection:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});



router.delete('/:id', async (req, res) => {
    try {
        const userId = req.session.userId; // Accessing userId from session
        const mangaId = req.params.id;

        if (!userId || !mangaId)
            return res.status(400).send({ message: "User ID and Manga ID are required" });

        let user = await User.findById(userId);

        if (!user)
            return res.status(404).send({ message: "User not found" });

        if (!user.collections)
            user.collections = [];

        const index = user.collections.indexOf(mangaId);
        if (index !== -1) {
            user.collections.splice(index, 1);
            await user.save();
            res.status(200).send({ message: "Manga removed from collection successfully" });
        } else {
            res.status(404).send({ message: "Manga not found in user's collection" });
        }
    } catch (error) {
        console.error("Error removing manga from collection:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;