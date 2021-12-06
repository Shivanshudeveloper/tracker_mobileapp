import React, { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { makeStyles } from '@material-ui/styles'
import axios from 'axios'
import { API_SERVICE } from '../URI'

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
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const data = {
        email,
        password,
      }
      const res = await axios.post(
        `${API_SERVICE}/api/v1/main/tracker/login`,
        data,
        config
      )

      if (res.data.success) {
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
        navigate('/app/dashboard', { replace: true })
      } else {
        alert(res.data.data)
      }
    } catch (error) {
      alert(error)
    }
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
