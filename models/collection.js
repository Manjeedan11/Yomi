const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    mangaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MangaDetails',
        required: true
    },
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
    },
    synopsis: {
        type: String,
        required: true
    },
    
    image: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },
    // Add other fields as needed
}, { timestamps: true });

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;
