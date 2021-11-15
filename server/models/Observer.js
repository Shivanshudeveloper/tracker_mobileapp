const mongoose = require("mongoose");

const observerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const observerData = mongoose.model("observer", observerSchema);
module.exports = observerData;
