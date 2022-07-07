const mongoose = require('mongoose')

const hotspotSchema = new mongoose.Schema(
    {
        hotspotName: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        groups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            },
        ],
        location: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
            zipCode: {
                type: String,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
)

const Hotspot = mongoose.model('Hotspot', hotspotSchema)

module.exports = Hotspot
