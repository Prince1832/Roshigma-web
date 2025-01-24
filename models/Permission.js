const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for permissions
const permissionSchema = new Schema({
  model: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["Admin", "Staff", "User", "Noob"],
    required: true,
    default: "User",
  },
  operations: [{
    type: String,
    enum: ['GET', 'POST', 'PUT', 'DELETE'],
    useMultiSelect: true
  }]
});

// Create the Permission model
const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
