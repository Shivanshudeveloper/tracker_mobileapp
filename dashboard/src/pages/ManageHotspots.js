import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    Box,
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    ListItemText,
    Checkbox,
    Snackbar,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import EditHotspotDialogForm from '../components/hotspot/EditHotspotDialogForm'
import Geocoder from 'react-map-gl-geocoder'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import HotspotTable from '../components/hotspot/HotspotTable'
import {
    createHotspot,
    getHotspots,
    getAdminHotspots,
} from '../store/actions/hotspot'
import { getGroups } from '../store/actions/group'
import { useNavigate } from 'react-router'
import { useSubscription } from '../hooks/useSubscription'
import { getSubscriptionDetails } from '../utils/getSubscriptionDetails'

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

const ManageHotspots = () => {
    const mapRef = useRef()
    const [hotspotName, setHotspotName] = useState('')
    const [selectedGroups, setSelectedGroups] = useState([])
    // const [groups, setGroups] = useState([])
    const [location, setLocation] = useState('')
    const [lat, setlat] = useState(28.6077159025)
    const [long, setlong] = useState(77.224249103)
    const [zipCode, setZipCode] = useState(0)
    const [viewport, setViewport] = useState({
        width: '100%',
        height: 400,
        latitude: 28.6077159025,
        longitude: 77.224249103,
        zoom: 15,
    })
    const [selectedHotspot, setSelectedHotspot] = useState({})
    const [dialogOpen, setDialogOpen] = useState(false)
    const [addHotspotDialog, setAddHotspotDialog] = useState(false)
    // snackbar states
    const [snackOpen, setSnackOpen] = useState(false)
    const [successMsg, setSuccessMsg] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    // map states
    const [allViewport, setAllViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: 28.52,
        longitude: 77.402,
        zoom: 10,
    })
    const [load, setLoad] = useState(false)
    const [selected, setSelected] = useState(false)
    const [selectedLat, setSelectedLat] = useState(null)
    const [selectedLong, setSelectedLong] = useState(null)
    const [locationData, setLocationData] = useState({})

    // subscription state
    const [subscription, setSubscription] = useState(null)

    const dispatch = useDispatch()
    const hotspots = useSelector((state) => state.hotspots)
    const { hotspotList, success, error } = hotspots
    const groups = useSelector((state) => state.groups)
    const { groupList } = groups

    const userData = sessionStorage.getItem('userData')
        ? JSON.parse(sessionStorage.getItem('userData'))
        : null

    const adminData = sessionStorage.getItem('adminData')
        ? JSON.parse(sessionStorage.getItem('adminData'))
        : null

    const navigate = useNavigate()
    const { state } = useSubscription()

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken')

        if (!authToken) {
            navigate('/login')
        }
    }, [])

    useEffect(() => {
        const fetchSubDetail = async () => {
            const details = await getSubscriptionDetails(state)
            setSubscription(details)
        }

        fetchSubDetail()
    }, [])

    useEffect(async () => {
        if (userData !== null) {
            dispatch(getGroups(userData?.uid))
        }
    }, [dispatch])

    useEffect(() => {
        if (success) {
            setSuccessMsg(success)
            setSnackOpen(true)
        }

        if (error) {
            setErrorMsg(error)
            setSnackOpen(true)
        }
    }, [success, error])

    useEffect(async () => {
        if (adminData === null && userData !== null) {
            dispatch(getHotspots(userData.uid))
        }
        if (adminData !== null && userData !== null) {
            const { data } = await axios.get(
                `${API_SERVICE}/get/admin/${adminData.email}`
            )
            dispatch(
                getAdminHotspots({
                    createdBy: userData.uid,
                    adminGroups: data.groups,
                })
            )
        }
    }, [dispatch])

    useEffect(async () => {
        setLoad(true)
        axios
            .get(`${API_SERVICE}/getlatlong/${selectedLat}/${selectedLong}`)
            .then((response) => {
                console.log(response)
                setLocationData(response.data)
                setLoad(false)
            })
            .catch((err) => console.log(err))
    }, [selectedLat, selectedLong])

    const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
    )

    const handleGeocoderViewportChange = useCallback((newViewport) => {
        const geocoderDefaultOverrides = { transitionDuration: 1000 }

        getLatLong(newViewport.latitude, newViewport.longitude)

        return handleViewportChange({
            ...newViewport,
            ...geocoderDefaultOverrides,
        })
    }, [])

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setSnackOpen(false)
        setErrorMsg(null)
        setSuccessMsg(null)
    }

    const getLatLong = async (latitude, longitude) => {
        axios
            .get(`${API_SERVICE}/getlatlong/${latitude}/${longitude}`)
            .then((res) => {
                setLocation(res.data.formattedAddress)
                setZipCode(res.data.zipcode)
            })
            .catch((errorMsg) => {
                console.log(errorMsg)
            })
    }

    const saveHotspot = () => {
        if (subscription === null) {
            setErrorMsg(
                'You do not have any subscription. Please choose a plan'
            )
            setSnackOpen(true)
            return
        } else if (hotspotList.length === subscription.hotspotCount) {
            setErrorMsg(
                'You have used your hotspot quota. Please upgrade your subscription'
            )
            setSnackOpen(true)
            return
        } else if (hotspotName.length < 3) {
            setErrorMsg('Hotspot name must be atleast 3 characters')
            setSnackOpen(true)
            return
        }

        const body = {
            hotspotName,
            groups: selectedGroups,
            createdBy: userData.uid,
            location: {
                latitude: Number(lat.toPrecision(6)),
                longitude: Number(long.toPrecision(6)),
                zipCode,
            },
        }

        dispatch(createHotspot(body))
        setAddHotspotDialog(false)
        setHotspotName('')
        setSelectedGroups([])
        setLocation('')
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event
        setSelectedGroups(typeof value === 'string' ? value.split(',') : value)
    }

    const toggleEditHotspotDialog = (item) => {
        if (dialogOpen) {
            setDialogOpen(false)
        } else {
            setSelectedHotspot(item)
            setDialogOpen(true)
        }
    }

    return (
        <Box sx={{ width: '100%', p: 4, height: '100%' }}>
            <h2>Manage Hotspots</h2>

            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={12} md={6}>
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
                            onClick={() => setAddHotspotDialog(true)}
                        >
                            Add New Hotspot
                        </Button>
                    </Box>

                    <Box sx={{ my: 5 }}>
                        <HotspotTable
                            successMsg={setSuccessMsg}
                            errorMsg={setErrorMsg}
                            open={setSnackOpen}
                            toggleEditHotspotDialog={toggleEditHotspotDialog}
                        />
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{ height: '100' }}>
                    <ReactMapGL
                        {...allViewport}
                        mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
                        mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
                        onViewportChange={(nextViewport) =>
                            setAllViewport(nextViewport)
                        }
                    >
                        {hotspotList.map((hotspot) => (
                            <Marker
                                key={hotspot._id}
                                latitude={hotspot.location.latitude}
                                longitude={hotspot.location.longitude}
                            >
                                <button
                                    className='marker-btn'
                                    onMouseEnter={(e) => {
                                        e.preventDefault()
                                        setSelected(true)
                                        setSelectedLat(
                                            hotspot.location.latitude
                                        )
                                        setSelectedLong(
                                            hotspot.location.longitude
                                        )
                                    }}
                                    onMouseLeave={(e) => {
                                        e.preventDefault()
                                        setSelected(false)
                                    }}
                                >
                                    <img
                                        alt='Image'
                                        src='https://www.nbp.co.uk/Content/Images/uploaded/contact-branch-details.png'
                                    />
                                </button>
                            </Marker>
                        ))}
                        {selected ? (
                            <Popup
                                latitude={selectedLat}
                                longitude={selectedLong}
                                onClose={() => {
                                    setSelected(false)
                                    setSelectedLat(0)
                                    setSelectedLong(0)
                                }}
                            >
                                <div>
                                    {load ? (
                                        <p>Fetching Location ...</p>
                                    ) : (
                                        <p>{locationData.formattedAddress}</p>
                                    )}
                                </div>
                            </Popup>
                        ) : null}
                    </ReactMapGL>
                </Grid>
            </Grid>

            <Dialog
                open={addHotspotDialog}
                onClose={() => setAddHotspotDialog(false)}
            >
                <DialogTitle sx={{ fontSize: 22 }}>Add New Hotspot</DialogTitle>
                <DialogContent sx={{ width: 600 }}>
                    <form noValidate style={{ marginBottom: '20px' }}>
                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='hotspotName'
                            label='Hotspot Name'
                            name='hotspotName'
                            autoFocus
                            value={hotspotName}
                            onChange={(e) => setHotspotName(e.target.value)}
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
                                renderValue={(selected) => selected.join(', ')}
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

                        <TextField
                            variant='outlined'
                            margin='normal'
                            fullWidth
                            id='location'
                            label='Set Location'
                            name='location'
                            value={location}
                            onChange={(e) => {}}
                        />
                    </form>
                    <ReactMapGL
                        {...viewport}
                        ref={mapRef}
                        mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
                        mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
                        onViewportChange={(nextViewport) =>
                            setViewport(nextViewport)
                        }
                        onClick={async (e) => {
                            setlat(e.lngLat[1])
                            setlong(e.lngLat[0])
                            getLatLong(e.lngLat[1], e.lngLat[0])
                        }}
                    >
                        <Geocoder
                            mapRef={mapRef}
                            onViewportChange={handleGeocoderViewportChange}
                            mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
                            position='top-left'
                            marker={true}
                            countries='IN'
                            reverseGeocode={true}
                        />
                        <Marker key='1' latitude={lat} longitude={long}>
                            <button className='marker-btn'>
                                <img
                                    alt='Image'
                                    src='https://www.nbp.co.uk/Content/Images/uploaded/contact-branch-details.png'
                                />
                            </button>
                        </Marker>
                    </ReactMapGL>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddHotspotDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => saveHotspot()}>Save Hotspot</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog to Edit the Hotspot */}
            <EditHotspotDialogForm
                open={dialogOpen}
                setDialogOpen={setDialogOpen}
                selectedHotspot={selectedHotspot}
                trackingGroups={groupList}
                setSnackOpen={setSnackOpen}
                setSuccessMsg={setSuccessMsg}
                setErrorMsg={setErrorMsg}
            />

            {successMsg !== null && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleSnackClose}
                        severity='success'
                        variant='filled'
                        sx={{ width: '100%' }}
                    >
                        {successMsg}
                    </Alert>
                </Snackbar>
            )}
            {errorMsg !== null && (
                <Snackbar
                    open={snackOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleSnackClose}
                        severity='error'
                        variant='filled'
                        sx={{ width: '100%' }}
                    >
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    )
}

export default ManageHotspots
