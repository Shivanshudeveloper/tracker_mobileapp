import { createContext, useEffect, useReducer, useState } from 'react'
import { auth, db } from '../Firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { API_SERVICE } from '../URI'
import axios from 'axios'
import { doc, getDoc } from 'firebase/firestore'

const initialState = {
    customerId: null,
    subscriptions: [],
    cart: {},
}

const reducer = (state, action) => {
    if (action.type === 'SUBSCRIPTION_DATA_CHANGED') {
        const { customerId, subscriptions } = action.payload
        return {
            ...state,
            customerId,
            subscriptions,
            isInitialized: true,
        }
    }

    if (action.type === 'SELECT_PRODUCT') {
        console.log('Success', action.payload)
        const { cart } = action.payload
        return {
            ...state,
            cart,
        }
    }

    if (action.type === 'PAYMENT_DETAILS') {
        console.log('Success', action.payload)
        const { details } = action.payload
        return {
            ...state,
            cart: { ...state.cart, details },
        }
    }

    return state
}

export const SubscriptionContext = createContext({
    ...initialState,
})

export const SubscriptionProvider = (props) => {
    const { children } = props
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(async () => {
        onAuthStateChanged(auth, async (user) => {
            try {
                const ref = doc(db, 'trackerWebUser', user.uid)
                const snap = await getDoc(ref)

                let userData

                if (snap.exists()) {
                    const data = snap.data()
                    userData = {
                        uid: data.uid,
                        displayName: `${data.firstName} ${data.lastName}`,
                        email: data.email,
                    }
                } else {
                    const _email = user.email

                    const { data } = await axios.get(
                        `${API_SERVICE}/get/admin/${_email}`
                    )

                    const { createdBy } = data

                    const ref = doc(db, 'trackerWebUser', createdBy)
                    const snap = await getDoc(ref)

                    if (snap.exists()) {
                        const data = snap.data()
                        userData = {
                            uid: data.uid,
                            displayName: `${data.firstName} ${data.lastName}`,
                            email: data.email,
                        }
                    }
                }

                if (userData) {
                    const customer = await fetchCustomer(userData)
                    if (customer) {
                        const subscriptions = await fetchSubscriptions(
                            customer?.id
                        )
                        dispatch({
                            type: 'SUBSCRIPTION_DATA_CHANGED',
                            payload: {
                                customerId: customer?.id,
                                subscriptions: subscriptions,
                            },
                        })
                    }
                } else {
                    dispatch({
                        type: 'SUBSCRIPTION_DATA_CHANGED',
                        payload: {
                            customerId: null,
                            subscriptions: [],
                        },
                    })
                }
            } catch (error) {
                console.log(error.message)
                dispatch({
                    type: 'SUBSCRIPTION_DATA_CHANGED',
                    payload: {
                        customerId: null,
                        subscriptions: [],
                    },
                })
            }
        })
    }, [dispatch])

    const fetchCustomer = async ({ uid, displayName, email }) => {
        const config = {
            headers: {
                'Content-type': 'application/json',
            },
        }

        const body = {
            userId: uid,
            name: displayName,
            email,
        }

        const { data } = await axios.post(
            `${API_SERVICE}/create/customer`,
            body,
            config
        )

        return data
    }

    const fetchSubscriptions = async (customerId) => {
        console.log(customerId)
        const { data } = await axios.get(
            `${API_SERVICE}/subscriptions/${customerId}`
        )
        return data.result
    }

    return (
        <SubscriptionContext.Provider value={{ state, dispatch }}>
            {children}
        </SubscriptionContext.Provider>
    )
}

export const SubscriptionConsumer = SubscriptionContext.Consumer
