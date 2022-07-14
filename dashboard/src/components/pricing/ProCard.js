import React from 'react'
import {
    Button,
    Card,
    Chip,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Slider,
    Stack,
    Typography,
    Box,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

const ProCard = (props) => {
    const benefits = [
        'Unlimited Hotspots',
        'Unlimited Devices',
        'Unlimited Groups',
        'Unlimited Admins',
        'Get Report of Unlimited Period',
    ]
    return (
        <Card
            className='pricing-card pro'
            sx={{
                boxShadow: 15,
                py: 5,
                px: 4,
            }}
        >
            <Box>
                <Stack
                    spacing={2}
                    direction='row'
                    sx={{ mb: 1 }}
                    alignItems='center'
                    justifyContent='space-between'
                >
                    {/* <FavoriteBorderOutlinedIcon
                                sx={{
                                    fontSize: 50,
                                }}
                                htmlColor='#e91e63'
                            /> */}

                    <Typography
                        variant='h1'
                        sx={{ my: 2, fontSize: 40, color: 'white' }}
                    >
                        {`$${props.value}`}
                    </Typography>
                    {props.isCurrent && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    backgroundColor: '#4CAF50',
                                    borderRadius: '50%',
                                }}
                            ></div>
                            <Typography
                                variant='h4'
                                sx={{ my: 2, color: '#4CAF50', ml: 1 }}
                            >
                                Active
                            </Typography>
                        </Box>
                    )}
                </Stack>
                <Chip
                    label='Pro Account'
                    variant='outlined'
                    className='chip'
                    sx={{
                        my: 2,
                        color: '#fb8c00',
                        border: '1.5px solid #fb8c00',
                        width: '100%',
                    }}
                />

                <Stack direction='row' justifyContent='space-between'>
                    <Typography
                        variant='h1'
                        sx={{ my: 2, fontSize: 40, color: 'white' }}
                    >
                        $1{' '}
                        <span
                            style={{
                                color: 'gray',
                                fontSize: 15,
                                textTransform: 'uppercase',
                            }}
                        >
                            / user
                        </span>
                    </Typography>

                    <Typography
                        variant='h1'
                        sx={{ my: 2, fontSize: 40, color: 'white' }}
                    >
                        {`${props.value}`}
                    </Typography>
                </Stack>

                <Stack
                    spacing={2}
                    direction='row'
                    sx={{ mb: 1 }}
                    alignItems='center'
                >
                    <Typography variant='h5' color='white'>
                        0
                    </Typography>
                    <Slider
                        sx={{ color: 'whitesmoke' }}
                        value={props.value}
                        onChange={props.handleValueChange}
                        max={1000}
                    />
                    <Typography variant='h5' color='white'>
                        1000
                    </Typography>
                </Stack>

                <List sx={{ my: 3 }}>
                    {benefits.map((x) => (
                        <ListItem disablePadding key={x}>
                            <ListItemIcon>
                                <CheckCircleIcon
                                    htmlColor='#4CAF50'
                                    sx={{ fontSize: 27, my: 0.5, ml: 0.5 }}
                                />
                            </ListItemIcon>
                            <ListItemText primary={x} sx={{ color: 'white' }} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Button
                className='pro-btn btn'
                variant='contained'
                //</Card>disabled={props.isCurrent}
                sx={{
                    py: 1.4,
                    borderRadius: 25,
                    boxShadow: 5,
                }}
                onClick={props.action}
            >
                Pay as you go
            </Button>
        </Card>
    )
}

export default ProCard
