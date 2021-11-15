const mongoose = require("mongoose");

const TeacherYearSchema = new mongoose.Schema({
  yearOfJoining: {
    type: String,
    required: false,
  },
  total: {
    type: Number,
    required: false,
    default: 1,
  },
});
const TeacherYearData = mongoose.model("TeacherYear", TeacherYearSchema);
module.exports = TeacherYearData;
