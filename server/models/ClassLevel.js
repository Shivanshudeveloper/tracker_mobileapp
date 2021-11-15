const mongoose = require("mongoose");

const classLevelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  date: {
    date: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const classLevelData = mongoose.model("classLevel", classLevelSchema);
module.exports = classLevelData;
