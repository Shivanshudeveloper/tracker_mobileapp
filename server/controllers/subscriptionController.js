const asyncHandler = require('express-async-handler')
const stripe = require('../config/stripeConfig')
const StripeCustomer = require('../models/TrackingSubCustomer')

const subConfig = asyncHandler(async (req, res) => {
    try {
        const prices = await stripe.prices.list({
            expand: ['data.product'],
        })

        res.send({
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
            prices: prices.data,
        })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const createCustomer = asyncHandler(async (req, res) => {
    try {
        const { userId, email, name } = req.body
        console.log(userId, email, name)

        const result = await StripeCustomer.findOne({ userId })
        if (result) {
            const customer = await stripe.customers.retrieve(result.customerId)

            res.cookie('customer', customer.id, {
                maAge: 900000,
                httpOnly: true,
            })
            res.send(customer)
        } else {
            const customer = await stripe.customers.create({
                email,
                name,
                address: {
                    line1: '3297 Ryan Road',
                    postal_code: '57356',
                    city: 'Lake Andes',
                    country: 'US',
                },
            })

            res.cookie('customer', customer.id, {
                maAge: 900000,
                httpOnly: true,
            })

            const newCustomer = new StripeCustomer({
                userId,
                customerId: customer.id,
            })
            newCustomer.save((err, results) => {
                console.log(err)
                console.log(results)
            })

            res.send(customer)
        }
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

const createSubscription = asyncHandler(async (req, res) => {
    try {
        const { customerId, priceId, quantity } = req.body
        console.log(customerId, priceId, quantity)

        console.log(quantity)

        const subscription = await stripe.subscriptions.create({
            customer: customerId,
            items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        })
        res.send({
            subscriptionId: subscription.id,
            clientSecret:
                subscription.latest_invoice.payment_intent?.client_secret,
        })
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})

const invoicePreview = asyncHandler(async (req, res) => {
    try {
        const customerId = req.cookies['customer']
        const priceId = process.env[req.query.newPriceLookupKey.toUpperCase()]

        const subscription = await stripe.subscriptions.retrieve(
            req.query.subscriptionId
        )

        const invoice = await stripe.invoices.retrieveUpcoming({
            customer: customerId,
            subscription: req.query.subscriptionId,
            subscription_items: [
                {
                    id: subscription.items.data[0].id,
                    price: priceId,
                },
            ],
        })

        res.status(200).send({ invoice })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

const subscriptions = asyncHandler(async (req, res) => {
    try {
        const { customerId } = req.params

        const result = await stripe.subscriptions.list({
            customer: customerId,
            status: 'all',
            expand: ['data.default_payment_method'],
        })

        res.status(200).json({ result })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = {
    subConfig,
    createCustomer,
    createSubscription,
    invoicePreview,
    subscriptions,
}
