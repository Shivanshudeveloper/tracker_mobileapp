const mongoose = require('mongoose')

const deviceSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        trackingStatus: {
            type: String,
            required: true,
        },
        groups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Device = mongoose.model('Device', deviceSchema)

module.exports = Device
