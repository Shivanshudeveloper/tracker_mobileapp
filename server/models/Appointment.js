const mongoose = require("mongoose");

const teacherApptSchema = new mongoose.Schema({
  teacher: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  apptDate: {
    type: String,
    required: true,
  },
  observerId: {
    type: String,
    required: false,
  },
  teacherData: {
    type: Array,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const teacherApptData = mongoose.model("teacherAppt", teacherApptSchema);
module.exports = teacherApptData;
