import React, { useState } from 'react'
import Box from '@mui/material/Box'

import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Grid, TextField } from '@mui/material'
import { countries } from '../../utils/getCountryCode'
import { useSubscription } from '../../hooks/useSubscription'

function Details(props) {
    const { state } = useSubscription()
    const info = state?.cart?.details
    const [details, setDetails] = useState(
        info
            ? info
            : {
                  name: '',
                  address: '',
                  city: '',
                  state: '',
                  country: '',
              }
    )

    const handleChange = (e) => {
        setDetails({ ...details, [e.target.name]: e.target.value })
    }

    const handleDetails = (data) => {
        if (Object.values(data).includes('')) {
            props.setErrorMsg('All Fields are required')
            props.setSnackOpen(true)
            return
        }
        props.handleNext(data)
    }

    return (
        <Box>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <h4>Payment Details</h4>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        autoFocus
                        fullWidth
                        label='Card Holder Name'
                        name='name'
                        required
                        value={details.name}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item md={12} xs={12}>
                    <h4>Billing Details</h4>
                </Grid>
                <Grid item md={6} xs={12}>
                    <TextField
                        fullWidth
                        label='Street Address'
                        name='address'
                        required
                        value={details.address}
                        onChange={handleChange}
                    />
                </Grid>

                <Grid item md={6} xs={12}>
                    <FormControl fullWidth>
                        <InputLabel id='country-select'>Country</InputLabel>
                        <Select
                            required
                            labelId='country-select'
                            name='country'
                            value={details.country}
                            label='Country'
                            onChange={handleChange}
                        >
                            {countries.map((x) => (
                                <MenuItem
                                    sx={{ py: 1 }}
                                    key={x.code}
                                    value={x.code}
                                >{`${x.name} - ${x.code}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item md={6} xs={12}>
                    <TextField
                        fullWidth
                        label='State'
                        name='state'
                        required
                        value={details.state}
                        onChange={handleChange}
                    />
                </Grid>
                <Grid item md={6} xs={12}>
                    <TextField
                        fullWidth
                        label='City'
                        name='city'
                        required
                        value={details.city}
                        onChange={handleChange}
                    />
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
                        type='submit'
                        variant='contained'
                        onClick={() => handleDetails(details)}
                        sx={{
                            width: '100%',
                            py: 1.5,
                        }}
                    >
                        Continue to Pay
                    </Button>
                </Box>
            </Grid>
        </Box>
    )
}

export default Details
