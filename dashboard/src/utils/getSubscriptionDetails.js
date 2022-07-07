import axios from 'axios'
import { API_SERVICE } from '../URI'

const fetchPlans = async () => {
    const { data } = await axios.get(`${API_SERVICE}/subscription/config`)

    return data.prices
}

export const getSubscriptionDetails = async (state) => {
    let subscriptionDetail
    for (let sub of state?.subscriptions?.data) {
        if (sub.status === 'active') {
            subscriptionDetail = sub
            break
        }
    }

    if (subscriptionDetail) {
        const plans = await fetchPlans()
        const planArr =
            plans.length !== 0
                ? plans.filter((x) => x.id === subscriptionDetail.plan.id)
                : []

        if (planArr.length !== 0) {
            const plan = planArr[0]
            const productName = plan.product.name

            const sub = {
                planId: plan.id,
                productName,
                productId: plan.product.id,
                hotspotCount:
                    productName === 'Pro Plan' ? Number.MAX_VALUE : 10,
                deviceCount:
                    productName === 'Pro Plan'
                        ? subscriptionDetail.quantity
                        : Number.MAX_VALUE,
                groupCount: productName === 'Pro Plan' ? Number.MAX_VALUE : 2,
                adminCount: productName === 'Pro Plan' ? Number.MAX_VALUE : 0,
                reportCount: productName === 'Pro Plan' ? Number.MAX_VALUE : 1,
            }

            return sub
        }
    }

    return null
}
