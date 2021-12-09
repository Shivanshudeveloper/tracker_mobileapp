import React, { useState, useEffect } from 'react'
import { TextField, Button, Box, Snackbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const ProfileSetting = (props) => {
  const { open, success, error } = props

  const classes = useStyles()

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')

  const userInfo = JSON.parse(sessionStorage.getItem('userInfo'))

  useEffect(() => {
    if (userInfo !== null && userInfo !== undefined) {
      setEmail(userInfo.email)
      setFirstName(userInfo.firstName)
      setCompanyName(userInfo.companyName)
      setLastName(userInfo.lastName)
    }
  }, [])

  const updateProfileHandler = async () => {
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
      }
      const res = await axios.put(
        `${API_SERVICE}/api/v1/main/tracker/user/update`,
        data,
        config
      )

      if (res.data.success) {
        sessionStorage.setItem('userInfo', JSON.stringify(res.data.data))
        success('Profile updated successfully')
        open(true)
      } else {
        error(res.data.message)
        open(true)
      }
    } catch (error) {
      error(error)
      open(true)
    }
  }

  return (
    <Box>
      <form className={classes.form} noValidate>
        <TextField
          variant='outlined'
          margin='normal'
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
          fullWidth
          id='email'
          label='Company Name'
          name='companyName'
          autoComplete='text'
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Button variant='contained' onClick={() => updateProfileHandler()}>
          Update Profile
        </Button>
      </form>
    </Box>
  )
}

export default ProfileSetting
