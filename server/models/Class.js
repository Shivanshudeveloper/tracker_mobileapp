const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
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
  numberOfStudents: {
    type: Number,
    default: 0,
  },
  numberOfSubjects: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const classData = mongoose.model("class", classSchema);
module.exports = classData;
