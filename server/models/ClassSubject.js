const mongoose = require("mongoose");

const classSubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  batch: {
    type: String,
    required: true,
  },
  class: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const classSubjectData = mongoose.model("classSubject", classSubjectSchema);
module.exports = classSubjectData;
