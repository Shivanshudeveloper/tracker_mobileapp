const asyncHandler = require('express-async-handler')
const Device = require('../models/TrackingDevice')
const Group = require('../models/TrackingGroup')

const createDevice = asyncHandler(async (req, res) => {
    try {
        const { body } = req.body
        const doc = await Device.findOne({
            phoneNumber: body.phoneNumber,
            createdBy: body.createdBy,
        })

        if (doc) {
            return res
                .status(400)
                .json({
                    message: 'A device with this phone number already exist',
                })
        }

        const data = await Device.create(body)

        if (data) {
            await Group.updateMany(
                { _id: { $in: data.groups } },
                { $push: { devices: data._id } }
            )

            await Device.findById(data._id)
                .populate('groups', '_id groupName')
                .exec(function (err, data) {
                    if (err) {
                        res.status(403).json({
                            message: 'Something Went Wrong',
                        })
                    } else {
                        res.status(200)
                            .setHeader('Content-Type', 'application/json')
                            .send(data)
                    }
                })
        } else {
            res.status(400).json({ message: 'Something Went Wrong' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getDevices = asyncHandler(async (req, res) => {
    try {
        const { createdBy } = req.params

        await Device.find({ createdBy })
            .populate('groups', '_id groupName')
            .exec(function (err, data) {
                if (err) {
                    res.status(403).json({
                        message: 'Something Went Wrong',
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

const getDeviceByPhoneNumber = asyncHandler(async (req, res) => {
    try {
        const { phoneNumber } = req.params
        await Device.find({
            phoneNumber,
        })
            .populate({
                path: 'groups',
                populate: {
                    path: 'hotspots',
                    model: 'Hotspot',
                },
            })
            .exec(function (err, data) {
                if (err) {
                    console.log(err)
                    res.status(403).json({
                        message: 'Something Went Wrong',
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

const updateDevice = asyncHandler(async (req, res) => {
    try {
        const { _id, phoneNumber, createdBy } = req.body
        let doc

        if (_id) {
            doc = await Device.findById(_id)
        } else {
            doc = await Device.findOne({ phoneNumber, createdBy })
        }

        if (doc) {
            const temp = doc.groups
            doc.groups = req.body.groups || doc.groups
            doc.fullName = req.body.fullName || doc.fullName
            doc.trackingStatus = req.body.trackingStatus || doc.trackingStatus

            const updatedUser = await doc.save()

            await Group.updateMany(
                { _id: { $in: temp } },
                { $pull: { devices: doc._id } }
            )
            await Group.updateMany(
                { _id: { $in: doc.groups } },
                { $push: { devices: doc._id } }
            )

            await Device.findById(updatedUser._id)
                .populate('groups', '_id groupName')
                .exec(function (err, data) {
                    if (err) {
                        res.status(403).json({
                            message: 'Something went wrong',
                        })
                    } else {
                        res.status(200)
                            .setHeader('Content-Type', 'application/json')
                            .send(data)
                    }
                })
        } else {
            res.status(404).json({
                message: 'Invalid Document Id, Cannot Find Document',
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const deleteDevice = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.params
        const doc = await Device.findById(_id)

        if (doc) {
            const temp = doc.groups
            const data = await Device.deleteOne({ _id })
            if (data) {
                await Group.updateMany(
                    { _id: { $in: temp } },
                    { $pull: { devices: doc._id } }
                )

                res.status(200).send('Device Deleted Successfully')
            }
        } else {
            res.status(404).json({
                message: 'Invalid Document Id, Cannot find Document',
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getAdminDevices = asyncHandler(async (req, res) => {
    try {
        const { createdBy } = req.body
        const { adminGroups } = req.body

        await Device.find({
            createdBy,
            groups: { $elemMatch: { $in: adminGroups } },
        })
            .populate('groups', '_id groupName')
            .exec(function (err, data) {
                if (err) {
                    res.status(403).json({
                        message: `Something Went Wrong: ${err}`,
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
    createDevice,
    getDevices,
    getDeviceByPhoneNumber,
    updateDevice,
    deleteDevice,
    getAdminDevices,
}
