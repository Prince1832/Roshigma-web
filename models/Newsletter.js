const mongoose = require('mongoose');

// Model Schema
const newsletterSchema = new mongoose.Schema({
    email: { type: String, required: true, default: "No Emails", useEmail: true },
}, { timestamps: {} });

const NewsLetter = mongoose.model('Newsletter', newsletterSchema);

module.exports = NewsLetter