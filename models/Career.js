const mongoose = require('mongoose');

// Model Schema
const careerSchema = new mongoose.Schema({
    position: { type: String, required: true, default: "None" },
    type: { type: String, required: true, default: "None" },
    location: { type: String, required: true, default: "None" },
    shift: { type: String, required: true, default: "None" },
    salary: { type: String, required: true, default: "None" },
    description: { type: String, required: false, default: "None", useTextarea: true },
    content: { type: String, required: false, default: "None", useEditor: true },
    slug: { type: String, required: false, default: "None" },
    metaTitle: { type: String, required: false, default: "None" },
    metaDescription: { type: String, required: false, default: "None", useTextarea: true },
}, { timestamps: {} });

const Career = mongoose.model('Career', careerSchema);

module.exports = Career
