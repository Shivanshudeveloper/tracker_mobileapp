const asyncHandler = require('express-async-handler')
const LiveLocation = require('../models/TrackingLivelocation')

const addLocationByNumber = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber, location } = req.body
        const data = await LiveLocation.create({ phoneNumber, location })

        if (data) {
            res.status(200).send(data)
        } else {
            res.status(400).json({
                message: 'Something Went Wrong, Try Again Later',
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getLiveLocationByNumber = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber } = req.params
        const device = await LiveLocation.findOne({ phoneNumber })
        res.status(200).send(device)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getLiveLocationByNumbers = asyncHandler(async (req, res) => {
    try {
        const { phoneNumbers } = req.body
        const device = await LiveLocation.find({
            phoneNumber: { $in: phoneNumbers },
        })
        res.status(200).send(device)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const updateLocationByNumber = asyncHandler(async (req, res) => {
    try {
        const { location, phoneNumber } = req.body

        const device = await LiveLocation.findOne({ phoneNumber })
        if (device) {
            device.location = location || device.location
            await device.save()

            res.status(200).send(device)
        } else {
            res.status(404).send({ message: 'Device not found' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = {
    getLiveLocationByNumber,
    getLiveLocationByNumbers,
    addLocationByNumber,
    updateLocationByNumber,
}
