import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  Typography,
} from '@material-ui/core'
import Firebase, { firestore } from '../Firebase/index'
import { addForm } from '../store/actions/UserFormAction'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const ManageMobileDevices = () => {
  const classes = useStyles()

  const dispatch = useDispatch()
  const userInfo = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : null

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [designation, setDesignation] = useState('')
  const [salary, setSalary] = useState('')
  const [snackOpen, setSnackOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackOpen(false)
    setError(null)
    setSuccess(null)
  }

  const submitHandler = async () => {
    if (phoneNumber !== '' && phoneNumber.length === 10) {
      const requestRef = firestore
        .collection('trackingRequest')
        .doc(phoneNumber)

      addRequestToFirestore(requestRef)
    } else {
      setError('10 digit phone number is required')
      setSnackOpen(true)
    }
  }

  const addRequestToFirestore = (requestRef) => {
    requestRef.get().then((doc) => {
      if (doc.exists) {
        requestRef
          .update({
            requestList: Firebase.firestore.FieldValue.arrayUnion({
              requestPending: true,
              requestAccepted: false,
              requestRejected: false,
              companyName: userInfo.companyName,
              senderId: userInfo._id,
            }),
          })
          .then(() => {
            setSuccess(`Tracking Request has been sent to ${fullName}`)
            setSnackOpen(true)
          })
          .then(() => {
            dispatch(
              addForm(
                fullName,
                email,
                phoneNumber,
                designation,
                salary,
                userInfo.email,
                userInfo._id
              )
            )
          })
          .catch((err) => {
            setError(err)
            setSnackOpen(true)
          })
      } else {
        const requestList = [
          {
            requestPending: true,
            requestAccepted: false,
            requestRejected: false,
            companyName: userInfo.companyName,
            senderId: userInfo._id,
          },
        ]
        requestRef
          .set({ requestList })
          .then(() => {
            setSuccess(`Tracking Request has been sent to ${fullName}`)
            setSnackOpen(true)
          })
          .then(() => {
            dispatch(
              addForm(
                fullName,
                email,
                phoneNumber,
                designation,
                salary,
                userInfo.email,
                userInfo._id
              )
            )
          })
          .catch((err) => {
            setError(err)
            setSnackOpen(true)
          })
      }
    })
  }

  return (
    <>
      <Typography variant='h2' sx={{ ml: 10, mt: 3, mb: 3 }}>
        Add Mobile Devices
      </Typography>
      <Paper sx={{ width: 500, ml: 10, mt: 5, p: 4 }}>
        <Box>
          <form className={classes.form} noValidate>
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='fullName'
              label='Full Name'
              name='fullName'
              autoComplete='name'
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              id='phoneNumber'
              label='Phone Number'
              name='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='designation'
              label='Designation'
              name='designation'
              autoComplete='text'
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
            />
            <TextField
              variant='outlined'
              margin='normal'
              fullWidth
              id='salary'
              label='Salary'
              name='salary'
              autoComplete='text'
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <Button
              sx={{ mt: 2 }}
              variant='contained'
              onClick={() => submitHandler()}
            >
              Save and Send Tracking Request
            </Button>
          </form>
          {success !== null && (
            <Snackbar
              open={snackOpen}
              autoHideDuration={4000}
              onClose={handleSnackClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert
                onClose={handleSnackClose}
                severity='success'
                sx={{ width: '100%' }}
              >
                {success}
              </Alert>
            </Snackbar>
          )}
          {error !== null && (
            <Snackbar
              open={snackOpen}
              autoHideDuration={4000}
              onClose={handleSnackClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <Alert
                onClose={handleSnackClose}
                severity='error'
                sx={{ width: '100%' }}
              >
                {error}
              </Alert>
            </Snackbar>
          )}
        </Box>
      </Paper>
    </>
  )
}

export default ManageMobileDevices
