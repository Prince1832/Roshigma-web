const mongoose = require('mongoose');

// Model Schema
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true, default: "None" },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the User model
    },
    image: { type: String, required: false, default: "Miss ME", useImage: true },
    banner: { type: String, required: false, default: "None", useImage: true },
    description: { type: String, required: false, default: "None", useTextarea: true },
    content: { type: String, required: false, default: "None", useEditor: true },
    readTime: { type: String, required: true, default: "None" },
    slug: { type: String, required: false, default: "None" },
    metaTitle: { type: String, required: false, default: "None" },
    metaDescription: { type: String, required: false, default: "None", useTextarea: true },
    indexing: {
        type: String,
        enum: ["max-image-preview:large, max-snippet:-1, max-video-preview:-1", "noindex", "noindex, follow", "nofollow", "noindex, nofollow"],
        required: false,
        default: "max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    },
    blogSchema: { type: String, required: false, default: "None", useTextarea: true },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
    },
    action: {
        type: String,
        enum: ["Draft", "Publish"],
        required: true,
        default: "Draft",
    },
}, { timestamps: {} });

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog
