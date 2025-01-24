const mongoose = require('mongoose');

// Model Schema
const clientSchema = new mongoose.Schema({
    logo: { type: String, required: false, default: "Miss ME", useImage: true },
    companyName: { type: String, required: true, default: "None" },
}, { timestamps: {} });

const Client = mongoose.model('Client', clientSchema);

module.exports = Client