const asyncHandler = require('express-async-handler')
const Admin = require('../models/TrackingAdmin')
const Group = require('../models/TrackingGroup')
const postmark = require('postmark')

const createAdmin = asyncHandler(async (req, res) => {
    try {
        const { body } = req.body
        const data = await Admin.create(body)

        if (data) {
            res.status(200).send(data)
        } else {
            res.status(400).json({ error: 'Something Went Wrong' })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const getAdmin = asyncHandler(async (req, res) => {
    try {
        const { email } = req.params
        const admin = await Admin.findOne({ email })
        if (admin) {
            res.status(200)
                .setHeader('Content-Type', 'application/json')
                .send(admin)
        } else {
            res.status(400).json({ message: 'Invalid Email, Cannot find User' })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
})

const getAdmins = asyncHandler(async (req, res) => {
    try {
        const { createdBy } = req.params

        await Admin.find({ createdBy })
            .populate('groups', '_id groupName')
            .exec(function (err, data) {
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
        res.status(500).send(error.message)
    }
})

const updateAdmin = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.body
        const doc = await Admin.findById(_id)

        if (doc) {
            doc.email = req.body.email || doc.email
            doc.fullName = req.body.fullName || doc.fullName
            doc.passwordChanged =
                req.body.passwordChanged || doc.passwordChanged

            const updatedAdmin = await doc.save()

            await Admin.findById({ _id: updatedAdmin._id })
                .populate('groups', '_id groupName')
                .exec(function (err, data) {
                    if (err) {
                        res.status(403).json({
                            error: true,
                            message: `Something Went Wrong, ${err.message}`,
                        })
                    } else {
                        console.log('here')
                        console.log(data)
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

const deleteAdmin = asyncHandler(async (req, res) => {
    try {
        const { _id } = req.params
        const doc = await Admin.findById(_id)

        if (doc) {
            await Group.updateMany(
                { _id: { $in: doc.groups } },
                { $pull: { admins: doc._id } }
            )

            const data = await Admin.deleteOne({ _id })

            if (data) {
                res.status(200).send('Admin Deleted Successfully')
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

const sendEmailToAdmin = asyncHandler(async (req, res) => {
    try {
        const { to, subject, body } = req.body
        const from = process.env.FROM_EMAIL

        const serverToken = process.env.EMAIL_API
        const client = new postmark.ServerClient(serverToken)

        client
            .sendEmail({
                From: from,
                To: to,
                Subject: subject,
                TextBody: body,
            })
            .then(() => {
                res.status(200).send('Email sent successfully')
            })
    } catch (error) {
        res.status(500).send(error.message)
    }
})

module.exports = {
    createAdmin,
    getAdmin,
    getAdmins,
    updateAdmin,
    deleteAdmin,
    sendEmailToAdmin,
}
