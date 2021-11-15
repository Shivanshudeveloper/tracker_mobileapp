const mongoose = require("mongoose");

const educationUserSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  userEmail: { type: String },
  userRole: { type: String },
  userInstitute: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const educationUserData = mongoose.model("educationUser", educationUserSchema);
module.exports = educationUserData;
