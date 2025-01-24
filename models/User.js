const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true, useEmail: true },
  phone: { type: String, required: true, usePhone: true },
  password: { type: String, required: true, usePassword: true },
  role: {
    type: String,
    enum: ["Admin", "Staff", "User", "Noob"],
    required: true,
    default: "User",
  },
}, { timestamps: {} });


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
