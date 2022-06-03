import React, { useState } from 'react'
import { TextField, Button, Box, CircularProgress } from '@mui/material'
import { makeStyles } from '@material-ui/styles'
import { auth } from '../../Firebase/index'
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
}))

const SecuritySetting = (props) => {
  const { open, success, error } = props

  const classes = useStyles()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')

  const [isUpdating, setIsUpdating] = useState(false)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  const update = async () => {
    try {
      setIsUpdating(true)
      const user = auth.currentUser

      const credential = EmailAuthProvider.credential(
        userData.email,
        currentPassword
      )

      reauthenticateWithCredential(user, credential)
        .then(() => {
          updatePassword(user, newPassword)
            .then(() => {
              success('Password updated successfully')
              open(true)
              setNewPassword('')
              setCurrentPassword('')
              setIsUpdating(false)
            })
            .catch((err) => {
              const errorCode = err.code
              const errorMessage = err.message
              error(`${errorCode} ${errorMessage}`)
              open(true)
              setIsUpdating(false)
            })
        })
        .catch((err) => {
          const errorCode = err.code
          const errorMessage = err.message
          error(`${errorCode} ${errorMessage}`)
          open(true)
          setIsUpdating(false)
        })
    } catch (err) {
      error(err)
      open(true)
      setIsUpdating(false)
    }
  }

  return (
    <Box>
      <form className={classes.form} noValidate>
        <TextField
          variant='outlined'
          margin='normal'
          fullWidth
          id='password'
          label='Current Password'
          name='password'
          autoComplete='name'
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
          autoComplete='name'
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          sx={{ py: 1.2, px: 4, fontSize: 15, mt: 2 }}
          variant='contained'
          onClick={() => update()}
          startIcon={
            isUpdating && <CircularProgress size={20} color='inherit' />
          }
        >
          Update Password
        </Button>
      </form>
    </Box>
  )
}

export default SecuritySetting
