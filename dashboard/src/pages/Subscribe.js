import React, { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutForm from '../components/pricing/CheckOutForm'

const stripePromise = loadStripe(
    'pk_test_51LERE7SHgzLT4nCoLBiNHxLi1VA6lbqcTOnrkwtNlduP9Ht93k7NbY5OF4GXR8vdid3eig3lV1DAxS2XSshACkUe00hDCZvx5x'
)

const Subscribe = () => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    )
}

export default Subscribe
