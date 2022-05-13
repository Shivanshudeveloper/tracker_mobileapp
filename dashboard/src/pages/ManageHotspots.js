import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  InputAdornment,
  Divider,
  ListItem,
  IconButton,
  ListItemText,
  Checkbox,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core'
import { Create, Search } from '@material-ui/icons'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import EditHotspotDialogForm from '../components/hotspot/EditHotspotDialogForm'
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from 'firebase/firestore'
import { db } from '../Firebase/index'
import Geocoder from 'react-map-gl-geocoder'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import HotspotSetting from '../components/settings/HotspotSetting'

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
  const [groups, setGroups] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [trackingGroups, setTrackingGroups] = useState([])
  const [trackingHotspots, setTrackingHotspots] = useState([])
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
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const userData = sessionStorage.getItem('userData')
    ? JSON.parse(sessionStorage.getItem('userData'))
    : null

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

  const getLatLong = async (latitude, longitude) => {
    axios
      .get(`${API_SERVICE}/api/v1/main/getlatlong/${latitude}/${longitude}`)
      .then((res) => {
        setLocation(res.data.formattedAddress)
        setZipCode(res.data.zipcode)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  useEffect(() => {
    const groupsRef = collection(db, 'trackingGroups')
    const q = query(groupsRef, where('createdBy', '==', userData.uid))
    const unsub = onSnapshot(q, (snapshot) => {
      const groups = []
      snapshot.forEach((document) => {
        groups.push({ ...document.data(), id: document.id })
      })
      setTrackingGroups(groups)
    })
    return () => unsub()
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

  useEffect(() => {
    const hostspotRef = collection(db, 'trackingHotspots')
    const q = query(hostspotRef, where('createdBy', '==', userData.uid))
    const unsub = onSnapshot(q, (snapshot) => {
      const hotspots = []
      snapshot.forEach((document) => {
        hotspots.push({ ...document.data(), id: document.id })
      })
      setTrackingHotspots(hotspots)
    })
    return () => unsub()
  }, [])

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return
    }

    setSnackOpen(false)
    setError(null)
    setSuccess(null)
  }

  const saveHotspot = () => {
    const hostspotRef = collection(db, 'trackingHotspots')
    addDoc(hostspotRef, {
      hotspotName,
      createdBy: userData.uid,
      groups: groups,
      location: {
        lat,
        long,
        zipCode,
      },
    })
      .then((document) => {
        selectedGroups.forEach(async (id) => {
          const groupRef = doc(db, 'trackingGroups', id)

          updateDoc(groupRef, {
            hotspot: arrayUnion({
              hotspotName,
              id: document.id,
              zipCode,
            }),
          })
            .then(() => console.log('Group Updated'))
            .catch((error) => console.log(error))
        })
      })
      .then(() => {
        setHotspotName('')
        setSelectedGroups([])
        setGroups([])
        setLocation('')
        setSuccess(`Hotspot added successfully`)
        setSnackOpen(true)
      })
      .catch((error) => {
        console.log(error)
        setError(error.message)
        setSnackOpen(true)
      })
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedGroups(typeof value === 'string' ? value.split(',') : value)
  }

  const search = (e) => {
    const val = e.target.value
    setSearchQuery(val)

    const temp = trackingHotspots

    const res = temp.filter((item) =>
      item.hotspotName.toLowerCase().includes(val.toLowerCase())
    )

    setSearchResult(res)
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
    <Box sx={{ width: '100%', p: 4 }}>
      <h2>Manage Hotspots</h2>
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
      {/* <Grid container spacing={2}>

        <Grid item md={7}>
          <Paper
            sx={{
              mt: 5,
              p: 5,
              width: '80%',
              mb: 5,
              borderRadius: 5,
              boxShadow: 5,
            }}
          ></Paper>
        </Grid>


        <Grid item md={5}>
          <Paper sx={{ mt: 5, p: 5, borderRadius: 5, boxShadow: 5 }}>
            <Stack direction='row' justifyContent='space-between'>
              <Typography
                variant='h3'
                component='h3'
                alignSelf='center'
                sx={{ mb: 2 }}
              >
                Added Hostspots
              </Typography>
            </Stack>
            <Box sx={{ my: 1, py: 1.2 }}>
              <TextField
                fullWidth
                id='phoneNumber'
                name='phoneNumber'
                placeholder='Search Hotspots'
                onChange={(e) => search(e)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <Search />
                    </InputAdornment>
                  ),
                }}
                value={searchQuery}
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
                          onClick={() => toggleEditHotspotDialog(item)}
                        >
                          <Create />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item.hotspotName}
                        secondary={
                          <div
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            {item.groups.map((x) => (
                              <p style={{ marginRight: '10px' }}>
                                {x.groupName} ,
                              </p>
                            ))}
                          </div>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}

              {searchQuery.length === 0 &&
                trackingHotspots.map((item, index) => (
                  <Box key={item.id}>
                    <Divider />
                    <ListItem
                      secondaryAction={
                        <IconButton
                          edge='end'
                          aria-label='edit'
                          color='primary'
                          onClick={() => toggleEditHotspotDialog(item)}
                        >
                          <Create />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={item.hotspotName}
                        secondary={
                          <div
                            style={{ display: 'flex', flexDirection: 'row' }}
                          >
                            {item.groups.map((x, index) => (
                              <p style={{ marginRight: '10px' }}>
                                {x.groupName}
                                <span>
                                  {index + 1 === item.groups.length ? '' : ','}
                                </span>
                              </p>
                            ))}
                          </div>
                        }
                      />
                    </ListItem>
                  </Box>
                ))}
            </Box>
          </Paper>
        </Grid>
      </Grid> */}
      <Box sx={{ my: 5 }}>
        <HotspotSetting
          success={setSuccess}
          error={setError}
          open={setSnackOpen}
          toggleEditHotspotDialog={toggleEditHotspotDialog}
        />
      </Box>

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
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
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
          <Button onClick={() => setAddHotspotDialog(false)}>Cancel</Button>
          <Button onClick={() => saveHotspot()}>Save Hotspot</Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to Edit the Hotspot */}
      <EditHotspotDialogForm
        open={dialogOpen}
        setDialogOpen={setDialogOpen}
        selectedHotspot={selectedHotspot}
        trackingGroups={trackingGroups}
        setSnackOpen={setSnackOpen}
        setSuccess={setSuccess}
        setError={setError}
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

export default ManageHotspots