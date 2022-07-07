const asyncHandler = require('express-async-handler')
const Hotspot = require('../models/TrackingHotspot')
const Location = require('../models/TrackingLocations')

const addLocation = asyncHandler(async (req, res) => {
    try {
        const data = await Location.create({
            group: req.body.group,
            hotspot: req.body.hotspot,
            phoneNumber: req.body.phoneNumber,
            createdBy: req.body.createdBy,
            address: req.body.address,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            zipCode: req.body.zipCode,
            month: req.body.month,
            year: req.body.year,
        })

        if (data) {
            res.status(200).send(data)
        } else {
            res.status(500).json({ message: 'Something Went Wrong!' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getLocationByNumberAndTracker = asyncHandler(async (req, res) => {
    try {
        const { createdBy, phoneNumber, month } = req.params

        Location.find({ createdBy, phoneNumber, month: Number(month) })
            .populate('group', '_id groupName')
            .populate('hotspot', '_id hotspotName')
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) {
                    res.status(403).json({
                        error: true,
                        message: `Something Went Wrong, ${err.message}`,
                    })
                } else {
                    res.status(200)
                        .setHeader('Content-Type', 'application/json')
                        .send(data)
                }
            })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getLocationByNumber = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber } = req.params

        Location.find({ phoneNumber })
            .populate('group', '_id groupName')
            .populate('hotspot', '_id hotspotName')
            .sort({ createdAt: -1 })
            .exec((err, data) => {
                if (err) {
                    res.status(403).json({
                        error: true,
                        message: `Something Went Wrong, ${err.message}`,
                    })
                } else {
                    res.status(200)
                        .setHeader('Content-Type', 'application/json')
                        .send(data)
                }
            })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = {
    addLocation,
    getLocationByNumberAndTracker,
    getLocationByNumber,
}
