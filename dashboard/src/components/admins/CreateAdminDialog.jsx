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
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import { db } from '../../Firebase'

const CreateAdminDialog = (props) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  const isValidEmail = (enteredEmail) => {
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    return emailRegex.test(enteredEmail)
  }

  function verifyData() {
    if (fullName === '') {
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

  const createAdmin = async () => {
    if (verifyData()) {
      const ref = collection(db, 'trackerAdmin')
      await addDoc(ref, {
        fullName,
        email,
        groups: [],
        createdBy: props.createdBy,
        createdAt: Timestamp.now(),
        modifiedAt: Timestamp.now(),
      })
        .then(() => {
          props.success('Admin Added')
          props.setSnackOpen(true)
          setFullName('')
          setEmail('')
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
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.setOpen(false)}>Cancel</Button>
        <Button onClick={() => createAdmin()}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(CreateAdminDialog)
