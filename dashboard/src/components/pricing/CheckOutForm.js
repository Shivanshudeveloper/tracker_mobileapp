import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router'
import { Alert, Box, Button, Paper, Snackbar, Typography } from '@mui/material'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js'

import CardSection from './CardSection.js'
import Details from './Details.js'
import { useSubscription } from '../../hooks/useSubscription'
import SuccessDialog from './SuccessDialog.js'

export default function CheckoutForm() {
    const stripe = useStripe()
    const elements = useElements()
    const { state, dispatch } = useSubscription()
    const { cart } = state

    const [messages, _setMessages] = useState('')
    //const [paymentIntent, setPaymentIntent] = useState()
    const [isPaying, setIsPaying] = useState(false)

    const [snackOpen, setSnackOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState(null)

    const [successDialog, setSuccessDialog] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()
    const { quantity } = location.state

    // helper for displaying status messages.
    const setMessage = (message) => {
        _setMessages(`${messages}\n\n${message}`)
    }

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault()

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return
        }

        console.log(state?.cart)

        const { error, paymentIntent } = await stripe.confirmCardPayment(
            state?.cart?.clientSecret,
            {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: cart?.details.name,
                        address: {
                            line1: cart?.details.address,
                            postal_code: cart?.details.zip || '38483',
                            city: cart?.details?.city,
                            country: cart?.details?.country,
                        },
                    },
                },
            }
        )

        if (error) {
            // Show error to your customer (for example, insufficient funds)
            setMessage(error.message)
            setErrorMsg(error.message)
            setSnackOpen(true)
            console.log(error.message)
        } else {
            // The payment has been processed!
            if (paymentIntent.status === 'succeeded') {
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
                console.log('Success')
                setSuccessDialog(true)
            }
        }
        //setPaymentIntent(paymentIntent)
    }

    // if (paymentIntent && paymentIntent.status === 'succeeded') {
    //     //return <div>Success </div>
    //     setSuccessDialog(true)
    // }

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setSnackOpen(false)
        setErrorMsg(null)
    }

    const handleDialogClose = () => {
        setSuccessDialog(false)
    }

    return (
        <Box sx={{ p: 4, background: '#f0f2f5', minHeight: '100%' }}>
            <Box>
                <Button
                    startIcon={<ArrowBackIosNewOutlinedIcon />}
                    onClick={() => navigate('/app/pricing')}
                >
                    Go Back
                </Button>
            </Box>
            <Box sx={{ mt: 2, mb: 5 }}>
                <Typography variant='h2' sx={{ textAlign: 'center' }}>
                    Make a payment
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
                    Fill the payment form with Billing Address, Card Holder Name
                    and Card Details
                </Typography>
            </Box>

            <Paper
                sx={{
                    borderRadius: 3,
                    boxShadow: 10,
                    margin: '40px auto',
                    backgroundColor: 'background.paper',
                    p: 5,
                    maxWidth: '600px',
                    mt: 8,
                }}
            >
                {isPaying && (
                    <CardSection
                        handleBack={() => {
                            setIsPaying(false)
                        }}
                        handleSubmit={handleSubmit}
                        quantity={quantity}
                    />
                )}
                {!isPaying && (
                    <Details
                        handleNext={(details) => {
                            dispatch({
                                type: 'PAYMENT_DETAILS',
                                payload: {
                                    details: details,
                                },
                            })
                            setIsPaying(true)
                        }}
                        setErrorMsg={setErrorMsg}
                        setSnackOpen={setSnackOpen}
                    />
                )}
            </Paper>

            <SuccessDialog
                open={successDialog}
                handleClose={handleDialogClose}
            />

            {/* {!isPaying ? (
                <Details
                    handleNext={(details) => {
                        dispatch({
                            type: 'PAYMENT_DETAILS',
                            payload: {
                                details: details,
                            },
                        })
                        setIsPaying(true)
                    }}
                />
            ) : (
                <CardSection
                    handleBack={() => {
                        setIsPaying(false)
                    }}
                    handleSubmit={handleSubmit}
                />
            )}
            <div>{messages}</div> */}

            {errorMsg !== null && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleSnackClose}
                        severity='error'
                        sx={{ width: '100%' }}
                        variant='filled'
                    >
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    )
}
