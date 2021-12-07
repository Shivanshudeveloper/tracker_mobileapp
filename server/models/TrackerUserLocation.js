const mongoose = require('mongoose')

const UserLocationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    hotspot: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const UserLocation = mongoose.model('UserLocation', UserLocationSchema)

module.exports = UserLocation
