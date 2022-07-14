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
import CancelIcon from '@mui/icons-material/Cancel'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'

const FreeCard = (props) => {
    const benefits = [
        'Only 10 Hotspots',
        'Unlimited Devices',
        'Only 2 Groups',
        'No Admins',
        'Get Report of last 1 month',
    ]
    return (
        <Card
            className='pricing-card'
            sx={{
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
                    <Typography variant='h1' sx={{ my: 2, fontSize: 40 }}>
                        $0
                    </Typography>
                    {props.isCurrent && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <div
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    backgroundColor: 'green',
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
                    label='Free Account'
                    variant='outlined'
                    className='chip'
                    sx={{
                        my: 2,
                        color: '#e91e63',
                        border: '1.5px solid #e91e63',
                        width: '100%',
                    }}
                />
                <Typography variant='h1' sx={{ my: 2, fontSize: 40 }}>
                    $0{' '}
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

                <List sx={{ my: 3, mt: 8 }}>
                    {benefits.map((x, i) => (
                        <ListItem key={i} disablePadding>
                            <ListItemIcon>
                                {i === 1 ? (
                                    <CheckCircleIcon
                                        htmlColor='#4CAF50'
                                        sx={{ fontSize: 27, my: 0.5, ml: 0.5 }}
                                    />
                                ) : (
                                    <CancelIcon
                                        htmlColor='#e91e63'
                                        sx={{ fontSize: 27, my: 0.5, ml: 0.5 }}
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText primary={x} />
                        </ListItem>
                    ))}
                </List>
            </Box>

            <Button
                className='free-btn btn'
                variant='outlined'
                disabled={props.isCurrent}
                sx={{
                    py: 1.4,
                    borderRadius: 25,
                    boxShadow: 5,
                }}
                onClick={props.action}
            >
                Pick free plan
            </Button>
        </Card>
    )
}

export default FreeCard
