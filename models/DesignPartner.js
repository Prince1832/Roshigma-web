const mongoose = require('mongoose');

// Model Schema
const designPartnerSchema = new mongoose.Schema({
    logo: { type: String, required: false, default: "Miss ME", useImage: true },
    partnerName: { type: String, required: true, default: "None" },
    description: { type: String, required: false, default: "None", useTextarea: true },
}, { timestamps: {} });

const DesignPartner = mongoose.model('DesignPartner', designPartnerSchema);

module.exports = DesignPartner