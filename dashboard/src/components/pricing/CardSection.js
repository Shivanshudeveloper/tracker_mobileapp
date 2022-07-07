import React, { useState } from 'react'
import { CardElement, PaymentElement } from '@stripe/react-stripe-js'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Grid, TextField } from '@mui/material'
import { useSubscription } from '../../hooks/useSubscription'
import ArrowBackIosNewOutlinedIcon from '@mui/icons-material/ArrowBackIosNewOutlined'

function CardSection({ handleBack, handleSubmit, quantity }) {
    const { state } = useSubscription()
    console.log(state)

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h4>Enter Card Details</h4>
                </Grid>
                <Grid item xs={12}>
                    <Box>
                        <CardElement />
                    </Box>
                </Grid>
            </Grid>

            <Grid item xs={12}>
                <Box
                    mt={5}
                    alignItems='center'
                    justifyContent='space-between'
                    display='flex'
                >
                    <Button
                        startIcon={<ArrowBackIosNewOutlinedIcon />}
                        onClick={handleBack}
                    >
                        Go Back
                    </Button>
                    <Button
                        type='submit'
                        variant='contained'
                        onClick={handleSubmit}
                        sx={{ py: 1.2, fontSize: 14, px: '40px' }}
                    >
                        {`PAY  $${quantity}`}
                    </Button>
                </Box>
            </Grid>
        </Box>
    )
}

export default CardSection
