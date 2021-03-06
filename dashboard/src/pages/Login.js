import React, { useEffect, useState } from 'react'
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
import { signInWithEmailAndPassword } from 'firebase/auth'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
} from 'firebase/firestore'
import { API_SERVICE } from '../URI'
import axios from 'axios'

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
        margin: theme.spacing(8, 4),
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

const Login = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [remember, setRemember] = useState(false)

    const credentials = localStorage.getItem('credentials')
        ? JSON.parse(localStorage.getItem('credentials'))
        : null

    useEffect(() => {
        if (credentials !== null) {
            setEmail(credentials.email)
            setPassword(credentials.password)
            setRemember(credentials.checked)
        }
    }, [credentials])

    const submitHandler = async () => {
        const superRef = collection(db, 'trackerWebUser')
        const q = query(superRef, where('email', '==', email))
        await getDocs(q).then(async (docs) => {
            if (docs.size !== 0) {
                superAdminLogin()
            } else {
                adminLogin()
            }
        })
    }

    const adminLogin = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (credential) => {
                sessionStorage.setItem('authToken', credential.user.accessToken)
                try {
                    const { data } = await axios.get(
                        `${API_SERVICE}/get/admin/${email}`
                    )
                    const superAdminRef = doc(
                        db,
                        'trackerWebUser',
                        data.createdBy
                    )
                    const superData = await getDoc(superAdminRef)

                    if (superData.exists()) {
                        sessionStorage.setItem(
                            'userData',
                            JSON.stringify(superData.data())
                        )
                    }

                    sessionStorage.setItem('adminData', JSON.stringify(data))

                    if (data.passwordChanged) {
                        navigate('/app/dashboard', { replace: true })
                    } else {
                        navigate('/admin/change-password', { replace: true })
                    }
                } catch (error) {
                    console.log(error.message)
                }
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                alert(errorCode, errorMessage)
            })
    }

    const superAdminLogin = async () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user
                console.log(user)
                sessionStorage.setItem('authToken', user.accessToken)
                const docRef = doc(db, 'trackerWebUser', user.uid)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    sessionStorage.setItem(
                        'userData',
                        JSON.stringify(docSnap.data())
                    )
                    navigate('/app/dashboard', { replace: true })
                } else {
                    console.log('No such document!')
                }
            })
            .catch((error) => {
                const errorCode = error.code
                const errorMessage = error.message
                alert(errorCode, errorMessage)
            })
    }

    return (
        <Grid
            sx={{ height: '100%' }}
            container
            component='main'
            className={classes.root}
        >
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
                            id='email'
                            label='Email Address'
                            name='email'
                            autoComplete='email'
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                        <Box
                            sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                            <Link variant='body2'>Forgot password?</Link>
                        </Box>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    value={remember}
                                    color='primary'
                                    onChange={(e) =>
                                        setRemember(e.target.checked)
                                    }
                                />
                            }
                            label='Remember me'
                        />
                        <Button
                            fullWidth
                            variant='contained'
                            color='primary'
                            className={classes.login}
                            onClick={() => submitHandler()}
                        >
                            LOGIN
                        </Button>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                mt: 1.3,
                            }}
                        >
                            <Link
                                component={RouterLink}
                                to='/register'
                                variant='body2'
                                underline='hover'
                            >
                                Don't have an account? Sign up for free
                            </Link>
                        </Box>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}

export default Login
