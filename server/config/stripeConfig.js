const Stripe = require('stripe')
const stripe = Stripe(
    'sk_test_51LERE7SHgzLT4nCopY80MszSWImVV6Wxa1EN9W1HXoYabJomsGj12lTyW5yOAvBq2JuflDIaunrbZXBcYasqNo3T00Zj32rgHN'
)

module.exports = stripe
