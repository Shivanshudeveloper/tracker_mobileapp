import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
    Box,
    TextField,
    Button,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Checkbox,
} from '@mui/material'
import { makeStyles } from '@mui/styles'

import { db } from '../Firebase/index'
import { addDoc, collection, Timestamp } from 'firebase/firestore'
import EditDeviceDialog from '../components/devices/EditDeviceDialog'
import DeviceTable from '../components/devices/DeviceTable'
import {
    createDevice,
    getDevices,
    getAdminDevices,
} from '../store/actions/device'

import axios from 'axios'
import { API_SERVICE } from '../URI'
import { useNavigate } from 'react-router'
import { useSubscription } from '../hooks/useSubscription'
import { getSubscriptionDetails } from '../utils/getSubscriptionDetails'

const useStyles = makeStyles((theme) => ({
    form: {
        width: '100%',
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

    const userData = localStorage.getItem('userData')
        ? JSON.parse(localStorage.getItem('userData'))
        : null

    const adminData = localStorage.getItem('adminData')
        ? JSON.parse(localStorage.getItem('adminData'))
        : null

    // adding new device states
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([])
    const [selectedGroupsNames, setSelectedGroupsNames] = useState([])
    // added devices section states
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [selectedDevice, setSelectedDevice] = useState({})
    const [addDeviceDialog, setAddDeviceDialog] = useState(false)
    const [scheduleDialog, setScheduleDialog] = useState(false)
    // snackbar states
    const [snackOpen, setSnackOpen] = useState(false)
    const [successMsg, setSuccess] = useState(null)
    const [errorMsg, setError] = useState(null)
    // subscription state
    const [subscription, setSubscription] = useState(null)

    const dispatch = useDispatch()
    const groups = useSelector((state) => state.groups)
    const { groupList } = groups

    const devices = useSelector((state) => state.devices)
    const { success, error, deviceList } = devices

    const { state } = useSubscription()

    useEffect(() => {
        const fetchSubDetail = async () => {
            const details = await getSubscriptionDetails(state)
            setSubscription(details)
        }

        fetchSubDetail()
    }, [])

    useEffect(async () => {
        if (adminData === null && userData !== null) {
            dispatch(getDevices(userData.uid))
        }
        if (adminData !== null && userData !== null) {
            const { data } = await axios.get(
                `${API_SERVICE}/get/admin/${adminData.email}`
            )
            dispatch(
                getAdminDevices({
                    createdBy: userData.uid,
                    adminGroups: data.groups,
                })
            )
        }
    }, [dispatch])

    useEffect(() => {
        if (success) {
            setSuccess(success)
            setSnackOpen(true)
        }
        if (error !== undefined) {
            setError(error)
            setSnackOpen(true)
        }
    }, [success, error])

    useEffect(async () => {
        if (success === 'Device added succssfully') {
            if (phoneNumber.length !== 0) {
                await sendTrackingRequest()
                await sendNotificationToDevice()
            }

            setPhoneNumber('')
            setSelectedGroups([])
            setFullName('')
            setAddDeviceDialog(false)
        }
    }, [success])

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

    const sendTrackingRequest = async () => {
        const requestRef = collection(
            db,
            'trackingRequest',
            phoneNumber,
            'requests'
        )
        await addDoc(requestRef, {
            requestStatus: 'pending',
            companyName: userData.companyName,
            recieverFullName: fullName,
            sender: {
                id: userData.uid,
                profilePhoto: userData.profilePhoto,
            },
            createdAt: Timestamp.now(),
        }).catch((error) => console.log(error))
    }

    const sendNotificationToDevice = async () => {
        const androidRef = collection(
            db,
            'trackingAndroidNotification',
            phoneNumber,
            'notifications'
        )
        await addDoc(androidRef, {
            message: `${userData.companyName} has send you a tracking request`,
            status: 'pending',
            sender: {
                id: userData.uid,
                profilePhoto: userData.profilePhoto,
            },
            createdAt: Timestamp.now(),
            seen: false,
        }).catch((error) => console.log(error))
    }

    const addNewDevice = async () => {
        if (subscription === null) {
            setError('You do not have any subscription. Please choose a plan')
            setSnackOpen(true)
            return
        } else if (deviceList.length === subscription.deviceCount) {
            setError(
                'You have used your device quota. Please upgrade your subscription'
            )
            setSnackOpen(true)
            return
        } else if (phoneNumber.length === 0) {
            setError('Phone number is required')
            setSnackOpen(true)
            return
        } else if (!phoneNumber.startsWith('+')) {
            setError('Please enter valid country code. example - +911234567890')
            setSnackOpen(true)
            return
        } else if (fullName.length === 0) {
            setError('Full name is required')
            setSnackOpen(true)
            return
        }

        const body = {
            fullName,
            phoneNumber,
            groups: selectedGroups,
            createdBy: userData.uid,
            trackingStatus: 'pending',
        }

        dispatch(createDevice(body))
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setSelectedGroups(typeof value === 'string' ? value.split(',') : value)

        const arr = groupList.filter((x) => value.includes(x._id))
        setSelectedGroupsNames(arr.map((x) => x.groupName))
    }

    const closeAddDeviceDialog = () => {
        setFullName('')
        setPhoneNumber('')
        setSelectedGroups([])
        setAddDeviceDialog(false)
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
            </Box>

            <Box sx={{ mt: 5 }}>
                <DeviceTable
                    toggleEditDeviceDialog={toggleEditDeviceDialog}
                    scheduleDialog={scheduleDialog}
                    setScheduleDialog={setScheduleDialog}
                />
            </Box>

            {/** Dialog for adding a new device */}
            <Dialog
                open={addDeviceDialog}
                onClose={() => closeAddDeviceDialog()}
            >
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
                            placeholder='+911234567890'
                            name='phoneNumber'
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />

                        <FormControl
                            margin='normal'
                            fullWidth
                            variant='outlined'
                        >
                            <InputLabel id='device-group'>
                                Select Group
                            </InputLabel>
                            <Select
                                labelId='device-group'
                                label='Select Group'
                                value={selectedGroups}
                                onChange={handleChange}
                                multiple
                                renderValue={() =>
                                    selectedGroupsNames.join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                                {groupList.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        <Checkbox
                                            checked={
                                                selectedGroups.indexOf(
                                                    item._id
                                                ) > -1
                                            }
                                        />
                                        <ListItemText
                                            primary={item.groupName}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => closeAddDeviceDialog()}>
                        Cancel
                    </Button>
                    <Button onClick={() => addNewDevice()}>Save Device</Button>
                </DialogActions>
            </Dialog>

            {/** Dialog for editing a device */}
            <EditDeviceDialog
                editDialogOpen={editDialogOpen}
                setEditDialogOpen={setEditDialogOpen}
                selectedDevice={selectedDevice}
                trackingGroups={groupList}
                setSuccess={setSuccess}
                setError={setError}
                setSnackOpen={setSnackOpen}
            />

            {successMsg && (
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
                        variant='filled'
                    >
                        {successMsg}
                    </Alert>
                </Snackbar>
            )}
            {errorMsg && (
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
                        variant='filled'
                    >
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    )
}

export default ManageMobileDevices
