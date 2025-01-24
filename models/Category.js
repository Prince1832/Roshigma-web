const mongoose = require('mongoose');

// Model Schema
const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, default: "Her"},
}, { timestamps: {} });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category