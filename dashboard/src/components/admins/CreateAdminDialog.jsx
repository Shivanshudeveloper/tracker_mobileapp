import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../Firebase'

const CreateAdminDialog = (props) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  const isValidEmail = (enteredEmail) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return emailRegex.test(enteredEmail)
  }

  function verifyData() {
    if (fullName === '') {
      console.log('Full Name cannot be empty')
      return false
    } else if (email === '' || !isValidEmail(email)) {
      console.log('Invalid Email')
      return false
    } else if (phoneNumber === '' || phoneNumber.length < 10) {
      console.log('Phone number must be 10 digit long')
      return false
    }

    return true
  }

  const createAdmin = async () => {
    if (verifyData()) {
      const ref = collection(db, 'trackerAdmin')
      await addDoc(ref, {
        fullName,
        phoneNumber,
        email,
        groups: [],
        createdBy: props.createdBy,
      })
        .then(() => {
          console.log('Admin Added')
          setFullName('')
          setEmail('')
          setPhoneNumber('')
          props.setOpen(false)
        })
        .catch((err) => console.log(err.message))
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
        <TextField
          fullWidth
          margin="normal"
          id="phoneNumber"
          label="Phone Number"
          type="tel"
          variant="outlined"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button onClick={() => createAdmin()}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(CreateAdminDialog)
