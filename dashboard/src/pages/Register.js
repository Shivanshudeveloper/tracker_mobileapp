import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import { makeStyles } from '@mui/styles'
import { auth, db } from '../Firebase'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { Alert, Snackbar } from '@mui/material'

const useStyles = makeStyles((theme) => ({
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light'
                ? theme.palette.grey[50]
                : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(4, 2),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    login: {
        margin: theme.spacing(3, 0, 2),
        padding: theme.spacing(1.4),
        fontSize: 15,
    },
    googleLogin: {
        margin: theme.spacing(2, 0, 2),
        fontSize: 15,
    },
}))

const Register = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [policy, setPolicy] = useState(false)
    const [snackOpen, setSnackOpen] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    const submitHandler = async () => {
        if (firstName.length === 0) {
            setErrorMsg('First Name is required field')
            setSnackOpen(true)
        } else if (lastName.length === 0) {
            setErrorMsg('Last Name is required field')
            setSnackOpen(true)
        } else if (email.length === 0) {
            setErrorMsg('Email is required field')
            setSnackOpen(true)
        } else if (!email.match(emailRegex)) {
            setErrorMsg('Invalid Email')
            setSnackOpen(true)
        } else if (password.length < 6) {
            setErrorMsg('Password must be atleast 6 character long')
            setSnackOpen(true)
        } else if (companyName.length === 0) {
            setErrorMsg('Company Name is required field')
            setSnackOpen(true)
        } else {
            signUp()
        }
    }

    const signUp = async () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user

                updateProfile(auth.currentUser, {
                    displayName: firstName + lastName,
                }).catch((error) => console.log(error.message))

                const userData = {
                    uid: user.uid,
                    firstName,
                    lastName,
                    email: user.email,
                    profilePhoto:
                        'https://th.bing.com/th/id/OIP.9B2RxsHDB_s7FZT0mljnhQHaHa?pid=ImgDet&rs=1',
                    companyName,
                    createdAt: serverTimestamp(),
                }

                sessionStorage.setItem('authToken', user.accessToken)

                const userRef = doc(db, 'trackerWebUser', user.uid)

                await setDoc(userRef, userData)
                    .then(() => {
                        sessionStorage.setItem(
                            'userData',
                            JSON.stringify(userData)
                        )
                        navigate('/app/dashboard', { replace: true })
                    })
                    .catch((error) => {
                        const errorCode = error.code
                        setErrorMsg(getErrMsg(errorCode))
                        setSnackOpen(true)
                    })
            })
            .catch((error) => {
                const errorCode = error.code
                setErrorMsg(getErrMsg(errorCode))
                setSnackOpen(true)
            })
    }

    const getErrMsg = (msg) => {
        return msg.split('/')[1].split('-').join(' ')
    }

    return (
        <React.Fragment>
            <Grid sx={{ height: '100%' }} container component='main'>
                <CssBaseline />
                <Grid item xs={false} sm={4} md={7} className={classes.image} />
                <Grid
                    item
                    xs={12}
                    sm={8}
                    md={5}
                    component={Paper}
                    elevation={6}
                    square
                    sx={{ p: 2 }}
                >
                    <div className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography
                            component='h1'
                            variant='h1'
                            sx={{ mt: 1, mb: 4 }}
                        >
                            GPS REPORT
                        </Typography>
                        <form className={classes.form} noValidate>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='firstName'
                                label='First Name'
                                name='firstName'
                                autoComplete='name'
                                autoFocus
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='lastName'
                                label='Last Name'
                                name='lastName'
                                autoComplete='name'
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label='Email Address'
                                name='email'
                                autoComplete='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                id='email'
                                label='Company Name'
                                name='companyName'
                                autoComplete='text'
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                            />
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                autoComplete='current-password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value='remember'
                                        color='primary'
                                        checked={policy}
                                        onChange={(e) =>
                                            setPolicy(e.target.checked)
                                        }
                                    />
                                }
                                label={
                                    <Typography component='p'>
                                        I have read the{' '}
                                        <Link href='#' sx={{ color: 'blue' }}>
                                            Terms and Conditions
                                        </Link>
                                    </Typography>
                                }
                            />
                            <Button
                                disabled={!policy}
                                fullWidth
                                variant='contained'
                                color='primary'
                                className={classes.login}
                                onClick={() => submitHandler()}
                            >
                                Sign-Up
                            </Button>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 5,
                                }}
                            >
                                <Link
                                    component={RouterLink}
                                    to='/login'
                                    variant='body2'
                                    underline='hover'
                                >
                                    <Typography component='p'>
                                        Already have an account? Login here
                                    </Typography>
                                </Link>
                            </Box>
                        </form>
                    </div>
                </Grid>
            </Grid>

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
        </React.Fragment>
    )
}

export default Register
