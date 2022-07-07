const asyncHandler = require('express-async-handler')
const Hotspot = require('../models/TrackingHotspot')
const Group = require('../models/TrackingGroup')

const createHotspot = asyncHandler(async (req, res) => {
    try {
        const { body } = req.body
        const data = await Hotspot.create(body)

        if (data) {
            await Group.updateMany(
                { _id: { $in: data.groups } },
                { $push: { hotspots: data._id } }
            )

            await Hotspot.findById({ _id: data._id })
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
        res.status(500).send(error.message)
    }
})

const getHotspots = asyncHandler(async (req, res) => {
    try {
        const { createdBy } = req.params

        await Hotspot.find({ createdBy })
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
        res.status(500).send(error.message)
    }
})

const updateHotspot = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body
        const doc = await Hotspot.findById(_id)

        if (doc) {
            await Group.updateMany(
                { _id: { $in: doc.groups } },
                { $pull: { hotspots: doc._id } }
            )
            doc.groups = req.body.groups || doc.groups
            doc.location = req.body.location || doc.location
            doc.hotspotName = req.body.hotspotName || doc.hotspotName

            await Group.updateMany(
                { _id: { $in: doc.groups } },
                { $push: { hotspots: doc._id } }
            )

            const updatedHotspot = await doc.save()

            await Hotspot.findById({ _id: updatedHotspot._id })
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
            res.status(404).json({
                message: 'Invalid Document Id, Cannot Find Document',
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const deleteHotspot = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.params
        const doc = await Hotspot.findById(_id)

        if (doc) {
            await Group.updateMany(
                { _id: { $in: doc.groups } },
                { $pull: { hotspots: doc._id } }
            )

            const data = await Hotspot.deleteOne({ _id })

            if (data) {
                res.status(200).send('Hotspot Deleted Successfully')
            }
        } else {
            res.status(404).json({
                message: 'Invalid Document Id, Cannot Find Document',
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const getAdminHotspots = asyncHandler(async (req, res) => {
    try {
        const { createdBy } = req.body
        const { adminGroups } = req.body

        await Hotspot.find({
            createdBy,
            groups: { $elemMatch: { $in: adminGroups } },
        })
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
        res.status(500).send(error.message)
    }
})

module.exports = {
    createHotspot,
    getHotspots,
    updateHotspot,
    deleteHotspot,
    getAdminHotspots,
}
