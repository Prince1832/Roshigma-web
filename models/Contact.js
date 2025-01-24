const mongoose = require("mongoose");

// User Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, useEmail: true },
  phone: { type: String, required: true, usePhone: true },
  requirements: { type: String, required: false },
  message: { type: String, required: false },
}, { timestamps: {} });

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;