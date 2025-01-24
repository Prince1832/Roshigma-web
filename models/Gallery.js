const mongoose = require('mongoose');

// Model Schema
const gallerySchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    image: { type: String, required: false, default: "Miss ME", useImage: true },
    title: { type: String, required: true, default: "None" },
}, { timestamps: {} });

const Gallery = mongoose.model('Gallery', gallerySchema);

module.exports = Gallery