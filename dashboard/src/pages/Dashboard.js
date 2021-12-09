import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  Grid,
  Stack,
  ListItemSecondaryAction,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from '@material-ui/icons/Delete'

import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import PeopleIcon from '@material-ui/icons/People'
import Person from '@material-ui/icons/Person'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import Alert from '@material-ui/core/Alert'
import { makeStyles } from '@material-ui/styles'

import Locationview from './Locationview'

import Firebase, { firestore } from '../Firebase/index'

import { Search as SearchIcon } from 'react-feather'
import { addForm, getForm, delForm } from '../store/actions/UserFormAction'
import AllLocationView from './AllLocationView'

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

const Dashboard = () => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
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

    setOpen(false)
    setError(null)
    setSuccess(null)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const userInfo = sessionStorage.getItem('userInfo')
    ? JSON.parse(sessionStorage.getItem('userInfo'))
    : null

  const dispatch = useDispatch()
  const forms = useSelector((state) => state.forms)
  const { userForms } = forms

  let i = 0

  useEffect(() => {
    dispatch(getForm(userInfo.email))
  }, [])

  const submitHandler = async () => {
    if (phoneNumber !== '' && phoneNumber.length === 10) {
      const requestRef = firestore
        .collection('trackingRequest')
        .doc(phoneNumber)

      addRequestToFirestore(requestRef)
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

  const handleUserDelete = (id, index) => {
    dispatch(delForm(id))
    setSelectedIndex(selectedIndex - 1)
  }

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index)
  }

  return (
    <Box className={classes.root}>
      <Grid container sx={{ height: 'inherit' }}>
        {/* <Grid item xs={12} sx={{ pl: 2, pt: 2, pb: 2 }}>
          <Typography variant='h1' component='h2'>
            Dashboard
          </Typography>
        </Grid> */}
        <Grid item xs={2.4} sx={{ height: '100%' }}>
          <Paper sx={{ height: '100%' }} className={classes.paper}>
            <Box sx={{ maxWidth: 500 }}>
              <TextField
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SvgIcon fontSize='small' color='action'>
                        <SearchIcon />
                      </SvgIcon>
                    </InputAdornment>
                  ),
                }}
                placeholder='Search user'
                variant='outlined'
              />
            </Box>
            <List component='nav'>
              <ListItem
                key={-1}
                button
                sx={{
                  mt: 0.5,
                  mb: 0.5,
                  backgroundColor: '#F5F5F5',
                  pt: 1.5,
                  pb: 1.5,
                }}
                onClick={() => setSelectedIndex(-1)}
              >
                <ListItemAvatar>
                  <Avatar>
                    <PeopleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary='Overview All Devices' />
              </ListItem>
              {userForms !== undefined &&
                userForms.map((item, index) => (
                  <ListItem
                    key={i++}
                    button
                    sx={{ mt: 0.5, mb: 0.5, backgroundColor: '#F5F5F5' }}
                    selected={selectedIndex === index}
                    onClick={(event) => handleListItemClick(event, index)}
                  >
                    <ListItemAvatar>
                      <Avatar>
                        <Person />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.fullName} secondary='Active' />
                    <ListItemSecondaryAction>
                      {selectedIndex === index && (
                        <IconButton
                          edge='end'
                          color='error'
                          onClick={() => handleUserDelete(item._id, index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={9.6} sx={{ height: '100%' }}>
          <Stack
            direction='row'
            justifyContent='space-between'
            sx={{ padding: 2 }}
          >
            <Typography variant='h4' component='h2'>
              Current Activity
            </Typography>
            <Stack direction='row'>
              <Button
                variant='contained'
                sx={{ marginRight: 2 }}
                onClick={handleClickOpen}
              >
                Add User
              </Button>
              <Button variant='outlined'>Logout</Button>
            </Stack>
          </Stack>
          <Box>
            {userForms !== undefined &&
              userForms.length !== 0 &&
              selectedIndex === -1 && <AllLocationView userForms={userForms} />}
            {userForms !== undefined &&
              userForms.length !== 0 &&
              selectedIndex >= 0 && (
                <Locationview
                  userForm={userForms[selectedIndex]}
                  index={selectedIndex}
                />
              )}
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={open}
        fullWidth
        maxWidth='sm'
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>Create a new user</DialogTitle>
        <DialogContent>
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2, mt: 4 }}
            label='Full Name'
            variant='outlined'
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Email'
            variant='outlined'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Phone Number'
            variant='outlined'
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Designation'
            variant='outlined'
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          />
          <TextField
            id='outlined-basic'
            fullWidth
            sx={{ mb: 2 }}
            label='Salary'
            variant='outlined'
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Close
          </Button>
          <Button onClick={submitHandler} color='primary' autoFocus>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
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
  )
}

export default Dashboard
