import React, { useState, useEffect } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import {
  arrayRemove,
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../../Firebase'

const EditAdminDialog = (props) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    setFullName(props.selectedAdmin.fullName)
    setEmail(props.selectedAdmin.email)
  }, [props.selectedAdmin])

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

  //   console.log(props.selectedAdmin)

  const updateAdmin = async () => {
    if (verifyData()) {
      const ref = doc(db, 'trackerAdmin', props.selectedAdmin.id)
      await updateDoc(ref, {
        fullName,
        email,
        modifiedAt: Timestamp.now(),
      })
        .then(() => {
          props.selectedAdmin.groups.forEach(async ({ id }) => {
            const ref = doc(db, 'trackingGroups', id)
            await updateDoc(ref, {
              admins: arrayRemove({
                fullName: props.selectedAdmin.fullName,
                id: props.selectedAdmin.id,
              }),
            }).catch((error) => console.log(error))
          })

          props.selectedAdmin.groups.forEach(async ({ id }) => {
            const ref = doc(db, 'trackingGroups', id)
            await updateDoc(ref, {
              admins: arrayUnion({
                fullName: fullName,
                id: props.selectedAdmin.id,
              }),
            }).catch((error) => console.log(error))
          })
        })
        .then(() => {
          props.success('Admin Updated')
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
      <DialogTitle sx={{ fontSize: 18 }}>Edit Admin Details</DialogTitle>
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
        <Button onClick={() => updateAdmin()}>Update</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(EditAdminDialog)
