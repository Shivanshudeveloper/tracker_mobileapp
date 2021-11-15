const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
  },
  lName: {
    type: String,
    required: true,
  },
  DOB: {
    type: String,
    required: true,
  },
  Subject: {
    type: String,
    required: true,
  },
  Designation: {
    type: String,
    required: true,
  },
  Salary: {
    type: String,
    required: true,
  },
  dateOfJoining: {
    type: String,
    required: true,
  },
  yearOfJoining: {
    type: String,
    required: false,
  },
  Class: {
    type: String,
    required: false,
  },
  Email: {
    type: String,
    required: true,
  },
  Phone: {
    type: String,
    required: true,
  },
  Address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const TeacherData = mongoose.model("Teacher", TeacherSchema);
module.exports = TeacherData;
