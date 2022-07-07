const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema(
    {
        groupName: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        schedule: {
            startDay: {
                type: String,
                required: true,
            },
            endDay: {
                type: String,
                required: true,
            },
            time: {
                startTime: {
                    type: String,
                    required: true,
                },
                endTime: {
                    type: String,
                    required: true,
                },
            },
        },
        hotspots: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Hotspot',
            },
        ],
        admins: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Admin',
            },
        ],
        devices: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Device',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Group = mongoose.model('Group', groupSchema)

module.exports = Group
