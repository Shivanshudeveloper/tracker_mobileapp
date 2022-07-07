const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema(
    {
        hotspot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotspot',
        },
        device: {
            fullName: {
                type: String,
            },
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        date: {
            type: String,
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Attendance = mongoose.model('Attendance', attendanceSchema)

module.exports = Attendance
