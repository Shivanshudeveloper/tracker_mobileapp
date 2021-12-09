const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const TrackerUserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    policy: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

TrackerUserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

TrackerUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

const TrackerUserModel = mongoose.model('TrackerUser', TrackerUserSchema)

module.exports = TrackerUserModel
