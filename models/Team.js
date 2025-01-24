const mongoose = require('mongoose');

// Model Schema
const teamSchema = new mongoose.Schema({
    image: { type: String, required: false, default: "None", useImage: true },
    name: { type: String, required: true, default: "None" },
    position: { type: String, required: true, default: "None" },
    linkedin: { type: String, required: true, default: "None" },
    github: { type: String, required: true, default: "None" },
    twitter: { type: String, required: true, default: "None" },
    instagram: { type: String, required: true, default: "None" },
    bio: { type: String, required: false, default: "None", useTextarea: true },
}, { timestamps: {} });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team
