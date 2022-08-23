import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Box, Typography, CircularProgress } from '@mui/material'

import ProCard from '../components/pricing/ProCard'
import FreeCard from '../components/pricing/FreeCard'
import { useSubscription } from '../hooks/useSubscription'
import axios from 'axios'
import { API_SERVICE } from '../URI'

const Pricing = () => {
    const [quantity, setQuantity] = React.useState(500)
    const [currentPlan, setCurrentPlan] = useState('')
    const [prices, setPrices] = useState([])
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    const { state, dispatch } = useSubscription()
    const customerId = state?.customerId

    useEffect(() => {
        if (state.subscriptions) {
            let subscription

            if (state.subscriptions.length !== 0) {
                for (let sub of state?.subscriptions?.data) {
                    if (sub.status === 'active') {
                        subscription = sub
                        break
                    }
                }

                const plan = subscription ? subscription.plan.id : ''
                const subQuantity = subscription ? subscription.quantity : 0

                setCurrentPlan(plan)
                setQuantity(subQuantity)
            } else {
                setCurrentPlan('')
                setQuantity(0)
            }
        }
    }, [state])

    useEffect(() => {
        const fetchPrices = async () => {
            const { data } = await axios.get(
                `${API_SERVICE}/subscription/config`
            )

            setPrices(data.prices)
            setLoading(false)
        }

        fetchPrices()
    }, [])

    const handleValueChange = (_, newValue) => {
        setQuantity(newValue)
    }

    const createSubscription = async (product, amount) => {
        if (amount <= 0) {
            alert('Please select atlest one user')
            return
        }
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
            const body = {
                customerId,
                priceId: product.id,
                quantity: amount,
            }
            const { data } = await axios.post(
                `${API_SERVICE}/create/subscription`,
                body,
                config
            )

            console.log(data)
            const { clientSecret } = data

            if (!clientSecret) {
                console.log('Cannot create Subscription')
                dispatch({
                    type: 'SELECT_PRODUCT',
                    payload: {
                        cart: { product, clientSecret },
                    },
                })
                console.log('Here')

                if (product.product.name === 'Free Plan') {
                    window.location.reload()
                }
            } else {
                dispatch({
                    type: 'SELECT_PRODUCT',
                    payload: {
                        cart: { product, clientSecret },
                    },
                })

                if (product.product.name === 'Free Plan') {
                    window.location.reload()
                }
                navigate('/subscribe', { state: { quantity } })
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    if (loading) {
        return (
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress color='secondary' />
            </Box>
        )
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ mt: 2, mb: 5 }}>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>
                    Choose your plan
                </Typography>
                <Typography
                    vanriant='h6'
                    sx={{
                        textAlign: 'center',
                        mt: 2,
                        letterSpacing: 0.6,
                        color: 'gray',
                    }}
                >
                    Select one of our plans below as per your convenience
                </Typography>
            </Box>
            <Box
                className='card-container'
                sx={{
                    mt: 6,
                }}
            >
                {prices.map((price) => (
                    <Box key={price.id}>
                        {price.product.name === 'Pro Plan' && (
                            <ProCard
                                value={quantity}
                                handleValueChange={handleValueChange}
                                isCurrent={currentPlan === price.id}
                                action={() =>
                                    createSubscription(price, quantity)
                                }
                            />
                        )}
                        {price.product.name === 'Free Plan' && (
                            <FreeCard
                                isCurrent={currentPlan === price.id}
                                action={() => createSubscription(price, 1)}
                            />
                        )}
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default Pricing
