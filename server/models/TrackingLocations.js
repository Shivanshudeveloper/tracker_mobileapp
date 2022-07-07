const mongoose = require('mongoose')

const locationSchema = mongoose.Schema(
    {
        group: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            require: true,
        },
        hotspot: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Hotspot',
            require: true,
        },
        phoneNumber: {
            type: String,
            require: true,
        },
        createdBy: {
            type: String,
            require: true,
        },
        address: {
            type: String,
            require: true,
        },
        latitude: {
            type: Number,
            require: true,
        },
        longitude: {
            type: Number,
            require: true,
        },
        zipCode: {
            type: String,
            require: true,
        },
        month: {
            type: Number,
            require: true,
        },
        year: {
            type: Number,
            require: true,
        },
    },
    {
        timestamps: true,
    }
)

const Location = mongoose.model('Location', locationSchema)

module.exports = Location
