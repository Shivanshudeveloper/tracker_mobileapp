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
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore'

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

const Login = () => {
  const classes = useStyles()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [policy, setPolicy] = useState(false)

  const submitHandler = async () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        const userData = {
          uid: user.uid,
          firstName,
          lastName,
          email: user.email,
          profilePicture:
            'https://th.bing.com/th/id/OIP.9B2RxsHDB_s7FZT0mljnhQHaHa?pid=ImgDet&rs=1',
          companyName,
          createdAt: serverTimestamp(),
        }

        const userRef = doc(db, 'trackerWebUser', user.uid)

        await setDoc(userRef, userData)
          .then(() => {
            sessionStorage.setItem('userData', JSON.stringify(userData))
            navigate('/app/dashboard', { replace: true })
          })
          .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            alert(errorCode, errorMessage)
          })
      })
      .catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        alert(errorCode, errorMessage)
      })
  }

  return (
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
          <Typography component='h1' variant='h1' sx={{ mt: 1, mb: 4 }}>
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
                  onChange={(e) => setPolicy(e.target.checked)}
                />
              }
              label='I have read the Terms and Conditions'
            />
            <Button
              fullWidth
              variant='contained'
              color='primary'
              className={classes.login}
              onClick={() => submitHandler()}
            >
              Sign-Up
            </Button>
            {/* <Typography sx={{ textAlign: 'center' }} variant='h4'>
              OR
            </Typography>
            <Button
              fullWidth
              variant='outlined'
              color='primary'
              className={classes.googleLogin}
            >
              <Avatar
                alt='Remy Sharp'
                src='/static/images/g.png'
                sx={{ marginRight: 1 }}
              />
              Sign-up with Google
            </Button> */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.3 }}>
              <Link
                component={RouterLink}
                to='/login'
                variant='body2'
                underline='hover'
              >
                Already have an account? Login here
              </Link>
            </Box>
          </form>
        </div>
      </Grid>
    </Grid>
  )
}

export default Login
