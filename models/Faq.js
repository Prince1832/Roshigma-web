const mongoose = require('mongoose');

// Model Schema
const faqSchema = new mongoose.Schema({
    question: { type: String, required: true, default: "Question is to be added"},
    answer: { type: String, required: true, default: "Question is to be added"},
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the User model
    },
}, { timestamps: {} });

const Faq = mongoose.model('Faq', faqSchema);

module.exports = Faq