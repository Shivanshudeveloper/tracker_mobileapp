const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  fields: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  observerId: {
    type: String,
    required: false,
  },
  noOfResponses: {
    type: Number,
    required: false,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const formData = mongoose.model("form", formSchema);
module.exports = formData;
