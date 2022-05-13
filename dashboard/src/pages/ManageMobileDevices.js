import React, { useState, useEffect } from 'react'
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Checkbox,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import { Search } from '@material-ui/icons'
import { db } from '../Firebase/index'
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  where,
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  getDoc,
  Timestamp,
} from 'firebase/firestore'
import { Create } from '@material-ui/icons'
import EditDeviceDialog from '../components/devices/EditDeviceDialog'
import DeviceSetting from '../components/settings/DeviceSetting'

const useStyles = makeStyles((theme) => ({
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}))

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const ManageMobileDevices = () => {
  const classes = useStyles()

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

  // adding new device states
  const [fullName, setFullName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([])
  const [groups, setGroups] = useState([])
  // added devices section states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [trackingUsers, setTrackingUsers] = useState([])
  const [trackingGroups, setTrackingGroups] = useState([])
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState({})
  const [addDeviceDialog, setAddDeviceDialog] = useState(false)
  // creating group dialog states
  const [open, setOpen] = useState(false)
  const [groupName, setGroupName] = useState('')
  // snackbar states
  const [snackOpen, setSnackOpen] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const trackingUserRef = collection(db, 'trackingUsers')
    const q = query(trackingUserRef, where('senderId', '==', userData.uid))

    return onSnapshot(q, (snapshot) => {
      const users = []
      snapshot.forEach((document) => {
        users.push({ ...document.data(), id: document.id })
      })
      setTrackingUsers(users)
    })
  }, [])

  useEffect(() => {
    const groupsRef = collection(db, 'trackingGroups')
    const q = query(groupsRef, where('createdBy', '==', userData.uid))

    return onSnapshot(q, (snapshot) => {
      const groups = []
      snapshot.forEach((document) => {
        groups.push({ ...document.data(), id: document.id })
      })
      setTrackingGroups(groups)
    })
  }, [])

  useEffect(() => {
    const arr = []
    selectedGroups.forEach((x) => {
      const d = trackingGroups.filter((item) => item.id === x)[0]
      const data = {
        groupName: d.groupName,
        id: d.id,
      }
      arr.push(data)
    })

    setGroups(arr)
  }, [selectedGroups])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackOpen(false)
    setError(null)
    setSuccess(null)
  }

  // toggle edit devices dialog
  const toggleEditDeviceDialog = (item) => {
    if (editDialogOpen) {
      setEditDialogOpen(false)
    } else {
      setSelectedDevice(item)
      setEditDialogOpen(true)
    }
  }

  const addNewDevice = async () => {
    if (phoneNumber !== '' && phoneNumber.length === 10) {
      const userRef = collection(db, 'trackingUsers')

      addDoc(userRef, {
        fullName,
        phoneNumber,
        deviceGroups: groups,
        senderId: userData.uid,
      })
        .then(async () => {
          for (let group of groups) {
            const ref = doc(db, 'trackingGroups', group.id)
            updateDoc(ref, {
              members: arrayUnion(phoneNumber),
            }).catch((err) => console.log(error))
          }
        })
        .then(async () => {
          const requestRef = doc(db, 'trackingRequest', phoneNumber)

          setDoc(
            requestRef,
            {
              requestList: arrayUnion({
                requestStatus: 'pending',
                companyName: userData.companyName,
                senderId: userData.uid,
              }),
            },
            { merge: true }
          )
            .then(() => {
              setSuccess(`Tracking Request has been sent to ${fullName}`)
              setSnackOpen(true)
              setPhoneNumber('')
              setSelectedGroups([])
              setGroups([])
              setFullName('')
            })
            .catch((err) => {
              console.log(err)
            })
        })
        .then(async () => {
          const webRef = doc(db, 'trackingWebNotification', userData.uid)
          setDoc(
            webRef,
            {
              notificationList: arrayUnion({
                message: `Tracking Request has been sent to ${fullName}`,
                name: fullName,
                phoneNumber: phoneNumber,
                requestStatus: 'pending',
                createdAt: Timestamp.now(),
              }),
            },
            { merge: true }
          ).catch((err) => console.log(err))

          const androidRef = doc(db, 'trackingAndroidNotification', phoneNumber)
          setDoc(
            androidRef,
            {
              notificationList: arrayUnion({
                message: `${userData.companyName} has send you a tracking request`,
                status: 'pending',
                senderId: userData.uid,
                createdAt: Timestamp.now(),
              }),
            },
            { merge: true }
          ).catch((err) => console.log(err))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  const createGroup = async () => {
    if (groupName.length < 3) {
      setError('Group Name length must be atleast 3')
      setSnackOpen(true)
      return
    }

    const groupRef = collection(db, 'trackingGroups')
    addDoc(groupRef, {
      groupName: groupName,
      createdBy: userData.uid,
      members: [],
      hotspot: [],
    })
      .then(() => {
        console.log('Group Created')
        setSuccess('Group Created')
        setSnackOpen(true)
      })
      .catch((err) => {
        console.log(err)
      })

    setOpen(false)
    setGroupName('')
  }

  const search = async (e) => {
    const val = e.target.value
    setSearchQuery(val)

    const temp = trackingUsers
    console.log(temp)

    const res = temp.filter(
      (item) =>
        item.fullName.toLowerCase().includes(val.toLowerCase()) ||
        item.phoneNumber.toLowerCase().includes(val.toLowerCase())
    )

    setSearchResult(res)
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedGroups(typeof value === 'string' ? value.split(',') : value)
  }

  const getGroups = (deviceGroups) => {
    let s = ''
    const len = deviceGroups.length

    deviceGroups.map((x, i) => {
      if (i === len - 1) {
        s = s + x.groupName
      } else {
        s = s + x.groupName + ', '
      }
    })

    return s
  }

  return (
    <Box sx={{ width: '100%', p: 4 }}>
      <h2>Manage Mobile Devices</h2>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          gap: 2,
        }}
      >
        <Button
          variant='contained'
          sx={{
            py: 1.2,
          }}
          onClick={() => setAddDeviceDialog(true)}
        >
          Add New Device
        </Button>
        <Button
          variant='contained'
          sx={{
            py: 1.2,
          }}
          onClick={() => setOpen(true)}
        >
          Add New Group
        </Button>
      </Box>

      <Box sx={{ mt: 5 }}>
        <DeviceSetting
          success={setSuccess}
          error={setError}
          open={setSnackOpen}
          toggleEditDeviceDialog={toggleEditDeviceDialog}
        />
      </Box>

      {/* <Grid container spacing={2}>

        <Grid item md={8}>
          <Paper sx={{ mt: 5, p: 5, width: 600, borderRadius: 5 }}></Paper>
        </Grid>


        <Grid item md={4}>
          <Paper sx={{ mt: 5, p: 5, borderRadius: 5 }}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography
                variant='h3'
                component='h3'
                alignSelf='center'
                sx={{ mb: 2 }}
              >
                Added Devices
              </Typography>
            </Stack>
            <Box sx={{ my: 1, py: 1.2 }}>
              <TextField
                fullWidth
                id='phoneNumber'
                name='phoneNumber'
                placeholder='Search Device'
                value={searchQuery}
                onChange={(e) => search(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            <Box sx={{ my: 1 }}>
              {searchQuery.length !== 0 &&
                searchResult.map((item, index) => (
                  <Box key={item.id}>
                    <Divider />
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge='end'
                          aria-label='edit'
                          color='primary'
                          onClick={() => toggleEditDeviceDialog(item)}
                        >
                          <Create />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${item.fullName} - ${item.phoneNumber}`}
                        //secondary={item.deviceGroup.groupName}
                      />
                    </ListItem>
                  </Box>
                ))}

              {searchQuery.length === 0 &&
                trackingUsers.map((item, index) => (
                  <Box key={item.id}>
                    <Divider />
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge='end'
                          aria-label='edit'
                          color='primary'
                          onClick={() => toggleEditDeviceDialog(item)}
                        >
                          <Create />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={`${item.fullName} - ${item.phoneNumber}`}
                        secondary={getGroups(item.deviceGroups)}
                      />
                    </ListItem>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>
      </Grid> */}

      {/** Dialog for adding a new device */}
      <Dialog open={addDeviceDialog} onClose={() => setAddDeviceDialog(false)}>
        <DialogTitle sx={{ fontSize: 22 }}>Add New Device</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
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
              id='phoneNumber'
              label='Phone Number'
              name='phoneNumber'
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />

            <FormControl margin='normal' fullWidth variant='outlined'>
              <InputLabel id='device-group'>Select Group</InputLabel>
              <Select
                labelId='device-group'
                label='Select Group'
                value={selectedGroups}
                onChange={handleChange}
                multiple
                renderValue={(selected) => selected.join(', ')}
                MenuProps={MenuProps}
              >
                {trackingGroups.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={selectedGroups.indexOf(item.id) > -1} />
                    <ListItemText primary={item.groupName} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDeviceDialog(false)}>Cancel</Button>
          <Button onClick={() => addNewDevice()}>Save Device</Button>
        </DialogActions>
      </Dialog>

      {/** Dialog for creating a new Group */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle sx={{ fontSize: 22 }}>Add New Group</DialogTitle>
        <DialogContent sx={{ width: 500 }}>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Group Name'
            type='text'
            fullWidth
            variant='standard'
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => createGroup()}>Create</Button>
        </DialogActions>
      </Dialog>

      {/** Dialog for editing a device */}
      <EditDeviceDialog
        editDialogOpen={editDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        selectedDevice={selectedDevice}
        trackingGroups={trackingGroups}
        setSuccess={setSuccess}
        setError={setError}
        setSnackOpen={setSnackOpen}
      />

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

export default ManageMobileDevices
