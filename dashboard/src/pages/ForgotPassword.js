import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
    Box,
    Button,
    Card,
    TextField,
    Snackbar,
    Alert,
    Link,
    Typography,
} from '@mui/material'

import { auth } from '../Firebase'
import { sendPasswordResetEmail } from 'firebase/auth'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [snackOpen, setSnackOpen] = useState(false)
    const [errorMsg, setErrMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const navigate = useNavigate()

    const sendLink = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                setSuccessMsg(`Password Reset Email Sent to ${email}`)
                setSnackOpen(true)
                setEmail('')
                setTimeout(() => {
                    navigate('/login')
                }, 4000)
            })
            .catch((error) => {
                const errorCode = error.code
                setErrMsg(getErrMsg(errorCode))
                setSnackOpen(true)
            })
    }

    const getErrMsg = (msg) => {
        console.log(msg)
        return msg.split('/')[1].split('-').join(' ')
    }

    return (
        <React.Fragment>
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    p: 5,
                }}
            >
                <Card
                    sx={{
                        width: 500,
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <h3 style={{ fontWeight: 500 }}>
                        Enter your registered Email Address
                    </h3>

                    <TextField
                        variant='outlined'
                        margin='normal'
                        fullWidth
                        type='email'
                        placeholder='Email Address'
                        label='Email Address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        sx={{ mt: 4 }}
                    />

                    <Button
                        onClick={sendLink}
                        fullWidth
                        variant='contained'
                        sx={{ py: 1.1, mt: 2 }}
                    >
                        Send Link
                    </Button>

                    <Box sx={{ mt: 2 }}>
                        <Link
                            component={RouterLink}
                            to='/login'
                            variant='body2'
                            underline='hover'
                        >
                            <Typography component='p'>Back to Login</Typography>
                        </Link>
                    </Box>
                </Card>
            </Box>
            {errorMsg && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackOpen(false)}
                        severity='error'
                        sx={{ width: '100%' }}
                        variant='filled'
                    >
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
            {successMsg && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={() => setSnackOpen(false)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={() => setSnackOpen(false)}
                        severity='success'
                        sx={{ width: '100%' }}
                        variant='filled'
                    >
                        {successMsg}
                    </Alert>
                </Snackbar>
            )}
        </React.Fragment>
    )
}

export default ForgotPassword
