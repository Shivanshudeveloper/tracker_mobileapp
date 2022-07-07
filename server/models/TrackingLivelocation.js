const mongoose = require('mongoose')

const livelocationSchema = mongoose.Schema(
    {
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        location: {
            latitude: {
                type: Number,
                required: true,
            },
            longitude: {
                type: Number,
                required: true,
            },
        },
    },
    {
        timestamps: true,
    }
)

const LiveLocation = mongoose.model('LiveLocation', livelocationSchema)

module.exports = LiveLocation
