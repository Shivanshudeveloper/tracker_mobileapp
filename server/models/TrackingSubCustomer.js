const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            required: true,
        },
        customerId: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const StripeCustomer = mongoose.model('StripeCustomer', customerSchema)

module.exports = StripeCustomer
