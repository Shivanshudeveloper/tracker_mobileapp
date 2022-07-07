const asyncHandler = require('express-async-handler')
const Attendance = require('../models/TrackingAttendance')

const addAttendance = asyncHandler(async (req, res) => {
    try {
        const isExist = await Attendance.findOne({
            phoneNumber: req.body.phoneNumber,
            hotspot: req.body.hotspot,
            date: req.body.date,
        })

        if (isExist) {
            res.status(403).json({ message: 'Attendance Already Marked' })
        } else {
            const data = await Attendance.create({
                hotspot: req.body.hotspot,
                device: req.body.device,
                phoneNumber: req.body.phoneNumber,
                createdBy: req.body.createdBy,
                date: req.body.date,
                month: req.body.month,
                year: req.body.year,
            })

            res.status(200).send(data)
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getAttendanceByTracker = asyncHandler(async (req, res) => {
    try {
        const { createdBy, month } = req.params

        const data = await Attendance.aggregate([
            { $match: { createdBy, month: Number(month) } },
            {
                $group: {
                    _id: {
                        phoneNumber: '$phoneNumber',
                        device: '$device',
                        hotspot: '$hotspot',
                    },
                    total: { $sum: 1 },
                },
            },
            {
                $group: {
                    _id: '$_id.phoneNumber',
                    device: {
                        $first: '$_id.device',
                    },
                    hotspots: {
                        $push: {
                            hotspot: '$_id.hotspot',
                            total: '$total',
                        },
                    },
                },
            },
            {
                $project: {
                    phoneNumber: '$_id',
                    device: '$device.fullName',
                    hotspots: '$hotspots',
                    _id: 0,
                },
            },
        ])

        res.status(200).send(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = { addAttendance, getAttendanceByTracker }
