const mongoose = require("mongoose");

const formResponsesSchema = new mongoose.Schema({
  data: {
    type: Array,
    required: true,
  },
  formId: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});
const formResponsesData = mongoose.model("formResponses", formResponsesSchema);
module.exports = formResponsesData;
