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
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

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

  const submitHandler = async () => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user
        console.log(user)
        const docRef = doc(db, 'trackerWebUser', user.uid)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          sessionStorage.setItem('userData', JSON.stringify(docSnap.data()))
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
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
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
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link variant='body2'>Forgot password?</Link>
            </Box>
            <FormControlLabel
              control={<Checkbox value='remember' color='primary' />}
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
              Login with Google
            </Button> */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.3 }}>
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
