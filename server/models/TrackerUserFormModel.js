const mongoose = require('mongoose')

const UserFormSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const UserForm = mongoose.model('UserForm', UserFormSchema)

module.exports = UserForm
