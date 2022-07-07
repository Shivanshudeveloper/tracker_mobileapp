const asyncHandler = require('express-async-handler')
const Admin = require('../models/TrackingAdmin')
const Device = require('../models/TrackingDevice')
const Group = require('../models/TrackingGroup')
const Hotspot = require('../models/TrackingHotspot')

const createGroup = asyncHandler(async (req, res) => {
    try {
        const { body } = req.body
        const data = await Group.create(body)

        if (data) {
            console.log(data)
            await Admin.updateMany(
                { _id: { $in: data.admins } },
                { $push: { groups: data._id } }
            )
            await Group.findById({ _id: data._id })
                .populate('hotspots', '_id hotspotName location')
                .populate('admins', '_id fullName')
                .exec(function (err, data) {
                    if (err) {
                        res.status(403).json({
                            error: true,
                            message: 'Something Went Wrong',
                        })
                    } else {
                        res.status(200)
                            .setHeader('Content-Type', 'application/json')
                            .send(data)
                    }
                })
        } else {
            res.status(400).json({ error: 'Something Went Wrong' })
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const getGroups = asyncHandler(async (req, res) => {
    try {
        const { createdBy } = req.params

        await Group.find({ createdBy })
            .populate('hotspots', '_id hotspotName location')
            .populate('admins', '_id fullName')
            .exec(function (err, data) {
                if (err) {
                    res.status(403).json({
                        error: true,
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

const updateGroup = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body
        const doc = await Group.findById(_id)

        if (doc) {
            const temp = doc.admins

            doc.admins = req.body.admins || doc.admins
            doc.groupName = req.body.groupName || doc.groupName
            doc.schedule = req.body.schedule || doc.schedule

            const updatedGroup = await doc.save()

            await Admin.updateMany(
                { _id: { $in: temp } },
                { $pull: { groups: doc._id } }
            )

            await Admin.updateMany(
                { _id: { $in: doc.admins } },
                { $push: { groups: doc._id } }
            )

            await Group.findById(updatedGroup._id)
                .populate('hotspots', '_id hotspotName location')
                .populate('admins', '_id fullName')
                .exec(function (err, data) {
                    if (err) {
                        res.status(403).json({
                            error: true,
                            message: 'Something Went Wrong',
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

const deleteGroup = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.params
        const doc = await Group.findById(_id)

        if (doc) {
            const deviceTemp = doc.devices
            const adminTemp = doc.admins
            const hotspotTemp = doc.hotspots

            const data = await Group.deleteOne({ _id })

            if (data) {
                await Device.updateMany(
                    { _id: { $in: deviceTemp } },
                    { $pull: { groups: doc._id } }
                )

                await Admin.updateMany(
                    { _id: { $in: adminTemp } },
                    { $pull: { groups: doc._id } }
                )

                await Hotspot.updateMany(
                    { _id: { $in: hotspotTemp } },
                    { $pull: { groups: doc._id } }
                )

                res.status(200).send('Group Deleted Successfully')
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = { createGroup, getGroups, updateGroup, deleteGroup }
