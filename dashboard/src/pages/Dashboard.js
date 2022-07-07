import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
    Box,
    TextField,
    InputAdornment,
    SvgIcon,
    Typography,
    Grid,
    MenuItem,
    Menu,
    Stack,
} from '@mui/material'
import { makeStyles } from '@mui/styles'

import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import PeopleIcon from '@mui/icons-material/People'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import { Search as SearchIcon } from 'react-feather'
import Locationview from './Locationview'
import AllLocationView from './AllLocationView'
import { db, auth } from '../Firebase/index'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import FilterAltIcon from '@mui/icons-material/FilterAlt'
import { getDevices, getAdminDevices } from '../store/actions/device'

import axios from 'axios'
import { API_SERVICE } from '../URI'
import { getAdminHotspots, getHotspots } from '../store/actions/hotspot'
import { getAdmins } from '../store/actions/admin'
import { getGroups } from '../store/actions/group'

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

    const [selectedIndex, setSelectedIndex] = useState(-1)
    // const [deviceList, setdeviceList] = useState([])
    const [userLocations, setUserLocations] = useState([])
    const [search, setSearch] = useState('')
    const [searchResult, setSearchResult] = useState([])

    const [snackOpen, setSnackOpen] = useState(false)
    const [success, setSuccess] = useState(null)
    const [error, setError] = useState(null)

    const [filter, setFilter] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const menuOpen = Boolean(anchorEl)

    const dispatch = useDispatch()
    const devices = useSelector((state) => state.devices)
    const { deviceList } = devices

    const handleFilterClick = (event) => {
        setAnchorEl(event.currentTarget)
    }
    const handleFilterClose = () => {
        setAnchorEl(null)
    }

    const navigate = useNavigate()

    const handleSnackClose = (_, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setSnackOpen(false)
        setError(null)
        setSuccess(null)
    }

    const userData = sessionStorage.getItem('userData')
        ? JSON.parse(sessionStorage.getItem('userData'))
        : null

    const adminData = sessionStorage.getItem('adminData')
        ? JSON.parse(sessionStorage.getItem('adminData'))
        : null

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken')

        if (!authToken) {
            navigate('/login')
        }
    }, [])

    useEffect(async () => {
        if (adminData === null && userData !== null) {
            dispatch(getDevices(userData.uid))
            dispatch(getHotspots(userData.uid))
            dispatch(getGroups(userData.uid))
            dispatch(getAdmins(userData.uid))
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
            dispatch(
                getAdminHotspots({
                    createdBy: userData.uid,
                    adminGroups: data.groups,
                })
            )
        }
    }, [dispatch])

    useEffect(() => {
        if (deviceList.length !== 0) {
            const phoneNumberArr = deviceList.map((x) => x.phoneNumber)
            const UsersRef = collection(db, 'trackerAndroidUser')
            const q = query(
                UsersRef,
                where('phoneNumber', 'in', phoneNumberArr)
            )

            const unsub = onSnapshot(q, (snapshot) => {
                const users = []

                snapshot.forEach((doc) => {
                    users.push(doc.data())
                })

                setUserLocations(users)
            })

            return () => unsub()
        }
    }, [deviceList])

    useEffect(() => {
        if (search.length === 0) {
            setSearchResult([])
        }

        setSelectedIndex(-1)
        const temp = deviceList

        const filterArr = temp.filter((x) =>
            x.fullName.toLowerCase().includes(search.toLowerCase())
        )

        setSearchResult(filterArr)
    }, [search])

    useEffect(() => {
        if (filter === 'all') {
            setSearchResult([])
            return
        }

        const temp = deviceList
        const filterArr = temp.filter((x) => x.trackingStatus === filter)
        setSearchResult(filterArr)
    }, [filter])

    const handleListItemClick = (_, index) => {
        setSelectedIndex(index)
    }

    const logout = () => {
        sessionStorage.removeItem('userData')
        signOut(auth)
            .then(() => navigate('/login', { replace: true }))
            .catch((error) => console.log(error))
    }

    const changeFilter = (val) => {
        setFilter(val)
        handleFilterClose()
    }

    const getInitials = (name) => {
        const arr = name.split(' ')
        const initials =
            arr[0].split('')[0].toUpperCase() +
            arr[1].split('')[0].toUpperCase()

        return initials
    }

    return (
        <Box className={classes.root}>
            <Grid container sx={{ height: 'inherit' }}>
                <Grid
                    item
                    xs={2.4}
                    sx={{
                        height: '100%',
                        overflowY: 'scroll',
                    }}
                    className='gridItem'
                >
                    <Paper sx={{ minHeight: '100%' }} className={classes.paper}>
                        <Box sx={{ maxWidth: 500 }}>
                            <TextField
                                fullWidth
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SvgIcon
                                                fontSize='small'
                                                color='action'
                                            >
                                                <SearchIcon />
                                            </SvgIcon>
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <IconButton onClick={handleFilterClick}>
                                            <SvgIcon
                                                fontSize='small'
                                                color='action'
                                            >
                                                <FilterAltIcon />
                                            </SvgIcon>
                                        </IconButton>
                                    ),
                                }}
                                placeholder='Search user'
                                variant='outlined'
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Menu
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={handleFilterClose}
                            >
                                <MenuItem
                                    sx={{ py: 1.2, px: 2.5 }}
                                    onClick={() => {
                                        changeFilter('all')
                                        setSelectedIndex(-1)
                                    }}
                                >
                                    All Requests
                                </MenuItem>
                                <MenuItem
                                    sx={{ py: 1.2, px: 2.5 }}
                                    onClick={() => {
                                        changeFilter('accepted')
                                        setSelectedIndex(-1)
                                    }}
                                >
                                    Accepted Requests
                                </MenuItem>
                                <MenuItem
                                    sx={{ py: 1.2, px: 2.5 }}
                                    onClick={() => {
                                        changeFilter('rejected')
                                        setSelectedIndex(-1)
                                    }}
                                >
                                    Rejected Requests
                                </MenuItem>
                                <MenuItem
                                    sx={{ py: 1.2, px: 2.5 }}
                                    onClick={() => {
                                        changeFilter('pending')
                                        setSelectedIndex(-1)
                                    }}
                                >
                                    Pending Requests
                                </MenuItem>
                            </Menu>
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
                                selected={selectedIndex === -1}
                                onClick={() => setSelectedIndex(-1)}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ backgroundColor: 'orange' }}>
                                        <PeopleIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary='Overview All Devices' />
                            </ListItem>

                            {searchResult.length === 0 &&
                                deviceList !== undefined &&
                                deviceList !== null &&
                                deviceList.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        disabled={
                                            item.trackingStatus === 'pending'
                                        }
                                        sx={{
                                            mt: 0.5,
                                            mb: 0.5,
                                            py: 2,
                                            backgroundColor: '#F5F5F5',
                                            borderLeft:
                                                item.trackingStatus ===
                                                'accepted'
                                                    ? '6px solid green'
                                                    : item.trackingStatus ===
                                                      'rejected'
                                                    ? '6px solid red'
                                                    : '6px solid orange',
                                        }}
                                        selected={selectedIndex === index}
                                        onClick={(event) =>
                                            handleListItemClick(event, index)
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'orange',
                                                }}
                                            >
                                                <Typography
                                                    fontSize={16}
                                                    letterSpacing={1}
                                                >
                                                    {getInitials(item.fullName)}
                                                </Typography>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={item.fullName} />
                                    </ListItem>
                                ))}

                            {/* showing search results */}
                            {searchResult.length !== 0 &&
                                searchResult.map((item, index) => (
                                    <ListItem
                                        key={index}
                                        button
                                        disabled={
                                            item.trackingStatus === 'pending'
                                        }
                                        sx={{
                                            mt: 0.5,
                                            mb: 0.5,
                                            py: 2,
                                            backgroundColor: '#F5F5F5',
                                            borderLeft:
                                                item.trackingStatus ===
                                                'accepted'
                                                    ? '6px solid green'
                                                    : item.trackingStatus ===
                                                      'rejected'
                                                    ? '6px solid red'
                                                    : '6px solid orange',
                                        }}
                                        selected={selectedIndex === index}
                                        onClick={(event) =>
                                            handleListItemClick(event, index)
                                        }
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                sx={{
                                                    backgroundColor: 'orange',
                                                }}
                                            >
                                                <Typography
                                                    fontSize={16}
                                                    letterSpacing={1}
                                                >
                                                    {getInitials(item.fullName)}
                                                </Typography>
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={item.fullName} />
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
                    </Stack>
                    <Box
                        sx={{
                            height: '90%',
                            py: 1,
                        }}
                    >
                        {selectedIndex === -1 && (
                            <AllLocationView
                                userList={userLocations}
                                senderId={userData?.uid}
                                trackingList={deviceList}
                            />
                        )}
                        {selectedIndex >= 0 && searchResult.length === 0 && (
                            <Locationview
                                user={deviceList[selectedIndex]}
                                index={selectedIndex}
                            />
                        )}

                        {selectedIndex >= 0 && searchResult.length !== 0 && (
                            <Locationview
                                user={searchResult[selectedIndex]}
                                index={selectedIndex}
                            />
                        )}
                    </Box>
                </Grid>
            </Grid>
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
