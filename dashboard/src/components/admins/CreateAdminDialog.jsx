import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { auth } from '../../Firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { createAdmin, sendEmail } from '../../store/actions/admin'

const CreateAdminDialog = (props) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  const dispatch = useDispatch()

  const isValidEmail = (enteredEmail) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return emailRegex.test(enteredEmail)
  }

  function verifyData() {
    if (props.subscription === null) {
      props.error('You do not have any subscription. Please choose a plan')
      props.setSnackOpen(true)
      return false
    } else if (props.adminList.length === props.subscription.adminCount) {
      props.error(
        'You have used your admin quota. Please upgrade your subscription',
      )
      props.setSnackOpen(true)
      return false
    } else if (fullName === '') {
      props.error('Full Name cannot be empty')
      props.setSnackOpen(true)
      return false
    } else if (email === '' || !isValidEmail(email)) {
      props.error('Invalid Email')
      props.setSnackOpen(true)
      return false
    }

    return true
  }

  const saveAdmin = async () => {
    if (verifyData()) {
      const password = '#123321#'

      await createUserWithEmailAndPassword(auth, email, password)
        .then(async function (user) {
          const body = {
            fullName,
            email,
            groups: [],
            createdBy: props.createdBy,
            passwordChanged: false,
          }
          dispatch(createAdmin(body))

          const emailData = {
            to: email,
            subject: 'GPS Tracker login credentials for admin',
            body: `Your login credentials are:\nemail: ${email}\npassword: ${password}`,
          }
          dispatch(sendEmail(emailData))

          setFullName('')
          setEmail('')
          props.setOpen(false)
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          alert(errorCode, errorMessage)
        })
    }
  }

  return (
    <Dialog open={props.open} onClose={() => props.setOpen(false)}>
      <DialogTitle sx={{ fontSize: 16 }}>Create New Admin</DialogTitle>
      <DialogContent sx={{ width: 500 }}>
        <TextField
          fullWidth
          autoFocus
          margin="normal"
          id="name"
          label="Full Name"
          type="name"
          variant="outlined"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          id="email"
          label="Email Address"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button onClick={() => saveAdmin()}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(CreateAdminDialog)
