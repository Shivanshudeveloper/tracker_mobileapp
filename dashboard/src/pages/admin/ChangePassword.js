import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import TextField from '@mui/material/TextField'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import { CircularProgress } from '@mui/material'
import { makeStyles } from '@mui/styles'
import { auth, db } from '../../Firebase'
import {
    EmailAuthProvider,
    reauthenticateWithCredential,
    signInWithEmailAndPassword,
    updatePassword,
} from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateAdmin } from '../../store/actions/admin'

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

const ChangePassword = () => {
    const classes = useStyles()
    const navigate = useNavigate()

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')

    const adminData = sessionStorage.getItem('adminData')
        ? JSON.parse(sessionStorage.getItem('adminData'))
        : null

    const dispatch = useDispatch()

    const submitHandler = async () => {
        if (adminData === null) {
            return
        }

        if (newPassword.length < 6) {
            alert('Password must be atleast 6 characters long.')
            return
        }

        const user = auth.currentUser
        const credential = EmailAuthProvider.credential(
            adminData.email,
            currentPassword
        )

        reauthenticateWithCredential(user, credential)
            .then(() => {
                updatePassword(user, newPassword)
                    .then(async () => {
                        const body = {
                            _id: adminData._id,
                            passwordChanged: true,
                        }
                        dispatch(updateAdmin(body))
                    })
                    .then(() => {
                        setNewPassword('')
                        setCurrentPassword('')
                        alert('Password updated successfully')

                        navigate('/app/dashboard', { replace: true })
                    })
                    .catch((err) => {
                        const errorCode = err.code
                        const errorMessage = err.message
                        alert(errorCode, errorMessage)
                    })
            })
            .catch((err) => {
                const errorCode = err.code
                const errorMessage = err.message
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
                        Change Password
                    </Typography>
                    <form className={classes.form} noValidate>
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='password'
                            label='Current Password'
                            name='password'
                            autoComplete='name'
                            type='password'
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='password'
                            label='New Password'
                            name='password'
                            type='password'
                            autoComplete='name'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                            fullWidth
                            variant='contained'
                            color='primary'
                            className={classes.login}
                            onClick={() => submitHandler()}
                        >
                            Change Password
                        </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    )
}

export default ChangePassword
