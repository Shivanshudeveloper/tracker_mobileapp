// import { Link as RouterLink, useNavigate } from 'react-router-dom'
// import { Helmet } from 'react-helmet'
// import * as Yup from 'yup'
// import { Formik } from 'formik'
// import {
//   Box,
//   Button,
//   Checkbox,
//   Container,
//   FormHelperText,
//   Link,
//   TextField,
//   Typography,
// } from '@material-ui/core'
// import axios from 'axios'
// import { API_SERVICE } from '../URI'

// const Register = () => {
//   const navigate = useNavigate()

//   return (
//     <>
//       <Helmet>
//         <title>Register | Material Kit</title>
//       </Helmet>
//       <Box
//         sx={{
//           backgroundColor: 'background.default',
//           display: 'flex',
//           flexDirection: 'column',
//           height: '100%',
//           justifyContent: 'center',
//         }}
//       >
//         <Container maxWidth='sm'>
//           <Formik
//             initialValues={{
//               email: '',
//               firstName: '',
//               lastName: '',
//               password: '',
//               companyName: '',
//               policy: false,
//             }}
//             validationSchema={Yup.object().shape({
//               email: Yup.string()
//                 .email('Must be a valid email')
//                 .max(255)
//                 .required('Email is required'),
//               firstName: Yup.string()
//                 .max(255)
//                 .required('First name is required'),
//               lastName: Yup.string().max(255).required('Last name is required'),
//               companyName: Yup.string()
//                 .max(255)
//                 .required('Company Name is required'),
//               password: Yup.string().max(255).required('password is required'),
//               policy: Yup.boolean().oneOf([true], 'This field must be checked'),
//             })}
//             onSubmit={async function (values) {
//               const config = {
//                 headers: {
//                   'Content-Type': 'application/json',
//                 },
//               }
//               const data = JSON.stringify(values)
//               await axios
//                 .post(
//                   `${API_SERVICE}/api/v1/main/tracker/register`,
//                   data,
//                   config
//                 )
//                 .then((res) => {
//                   if (res.data.success) {
//                     sessionStorage.setItem(
//                       'userInfo',
//                       JSON.stringify(res.data.data)
//                     )
//                     navigate('/app/dashboard', { replace: true })
//                   } else {
//                     alert(res.data.data)
//                   }
//                 })
//                 .catch((error) => alert(error))
//             }}
//           >
//             {({
//               errors,
//               handleBlur,
//               handleChange,
//               handleSubmit,
//               isSubmitting,
//               touched,
//               values,
//             }) => (
//               <form onSubmit={handleSubmit}>
//                 <Box sx={{ mb: 3 }}>
//                   <Typography color='textPrimary' variant='h2'>
//                     Create new account
//                   </Typography>
//                   <Typography
//                     color='textSecondary'
//                     gutterBottom
//                     variant='body2'
//                   >
//                     Use your email to create new account
//                   </Typography>
//                 </Box>
//                 <TextField
//                   error={Boolean(touched.firstName && errors.firstName)}
//                   fullWidth
//                   helperText={touched.firstName && errors.firstName}
//                   label='First name'
//                   margin='normal'
//                   name='firstName'
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.firstName}
//                   variant='outlined'
//                 />
//                 <TextField
//                   error={Boolean(touched.lastName && errors.lastName)}
//                   fullWidth
//                   helperText={touched.lastName && errors.lastName}
//                   label='Last name'
//                   margin='normal'
//                   name='lastName'
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   value={values.lastName}
//                   variant='outlined'
//                 />
//                 <TextField
//                   error={Boolean(touched.email && errors.email)}
//                   fullWidth
//                   helperText={touched.email && errors.email}
//                   label='Email Address'
//                   margin='normal'
//                   name='email'
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type='email'
//                   value={values.email}
//                   variant='outlined'
//                 />
//                 <TextField
//                   error={Boolean(touched.companyName && errors.companyName)}
//                   fullWidth
//                   helperText={touched.companyName && errors.companyName}
//                   label='Copany Name'
//                   margin='normal'
//                   name='companyName'
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type='text'
//                   value={values.companyName}
//                   variant='outlined'
//                 />
//                 <TextField
//                   error={Boolean(touched.password && errors.password)}
//                   fullWidth
//                   helperText={touched.password && errors.password}
//                   label='Password'
//                   margin='normal'
//                   name='password'
//                   onBlur={handleBlur}
//                   onChange={handleChange}
//                   type='password'
//                   value={values.password}
//                   variant='outlined'
//                 />
//                 <Box
//                   sx={{
//                     alignItems: 'center',
//                     display: 'flex',
//                     ml: -1,
//                   }}
//                 >
//                   <Checkbox
//                     checked={values.policy}
//                     name='policy'
//                     onChange={handleChange}
//                   />
//                   <Typography color='textSecondary' variant='body1'>
//                     I have read the{' '}
//                     <Link
//                       color='primary'
//                       component={RouterLink}
//                       to='#'
//                       underline='always'
//                       variant='h6'
//                     >
//                       Terms and Conditions
//                     </Link>
//                   </Typography>
//                 </Box>
//                 {Boolean(touched.policy && errors.policy) && (
//                   <FormHelperText error>{errors.policy}</FormHelperText>
//                 )}
//                 <Box sx={{ py: 2 }}>
//                   <Button
//                     color='primary'
//                     fullWidth
//                     size='large'
//                     type='submit'
//                     variant='contained'
//                   >
//                     Sign up now
//                   </Button>
//                 </Box>
//                 <Typography color='textSecondary' variant='body1'>
//                   Have an account?{' '}
//                   <Link
//                     component={RouterLink}
//                     to='/login'
//                     variant='h6'
//                     underline='hover'
//                   >
//                     Sign in
//                   </Link>
//                 </Typography>
//               </form>
//             )}
//           </Formik>
//         </Container>
//       </Box>
//     </>
//   )
// }

// export default Register

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
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const data = {
        firstName,
        lastName,
        email,
        companyName,
        password,
        policy,
      }
      const res = await axios.post(
        `${API_SERVICE}/api/v1/main/tracker/register`,
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
    <Grid sx={{ height: '100%' }} container component='main'>
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
