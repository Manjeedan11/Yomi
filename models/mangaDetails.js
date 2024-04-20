const mongoose = require("mongoose");

const mangaSchema = new mongoose.Schema({
    
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    
    author: {
        type: String,
        required: [true, "Author is required"]
    },
    
    demographic: {
        type: String,
        required: [true, "Demographic is required"]
    },
    
    genre: {
        type: String,
        required: [true, "Demographic is required"]
    },
    
    synopsis: {
        type: String,
        required: [true, "synopsis is required"]
    },

    image: {
        type: String,
        required: [true, "image url is required"]
    },

    description: {
        type: String,
        required: [true, "description is required"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('mangaDetails', mangaSchema);
