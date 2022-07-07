const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        passwordChanged: {
            type: Boolean,
            required: true,
        },
        groups: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Group',
            },
        ],
    },
    {
        timestamps: true,
    }
)

const Admin = mongoose.model('Admin', adminSchema)

module.exports = Admin
