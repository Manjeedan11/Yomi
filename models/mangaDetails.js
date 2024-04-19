const mongoose = require("mongoose");

const mangaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    demographic: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('mangaDetails', mangaSchema);
