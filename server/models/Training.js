const mongoose = require("mongoose");

const trainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  objective: {
    type: String,
    required: false,
  },
  startedAt: {
    type: String,
    required: false,
  },
  trainingClass: {
    type: String,
    required: false,
  },
  trainingCourse: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  teachers: {
    type: Array,
    default: [],
  },
});
const trainingData = mongoose.model("training", trainingSchema);
module.exports = trainingData;
