const mongoose = require('mongoose');

// Model Schema
const caseSchema = new mongoose.Schema({
    title: { type: String, required: true, default: "None" },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category', // Reference to the User model
    },
    image: { type: String, required: false, default: "Miss ME", useImage: true },
    description: { type: String, required: false, default: "None", useTextarea: true },
    content: { type: String, required: false, default: "None", useEditor: true },
    slug: { type: String, required: false, default: "None" },
    metaTitle: { type: String, required: false, default: "None" },
    metaDescription: { type: String, required: false, default: "None", useTextarea: true },
    canonical: { type: String, required: false, default: "None" },
    caseSchema: { type: String, required: false, default: "None", useTextarea: true },
    action: {
        type: String,
        enum: ["Draft", "Publish"],
        required: true,
        default: "Draft",
    },
}, { timestamps: {} });

const CaseStudy = mongoose.model('CaseStudy', caseSchema);

module.exports = CaseStudy
