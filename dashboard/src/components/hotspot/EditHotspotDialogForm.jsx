import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import Geocoder from 'react-map-gl-geocoder'
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css'
import axios from 'axios'
import { API_SERVICE } from '../../URI'
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../Firebase'
import { updateHotspot } from '../../store/actions/hotspot'

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

const EditHotspotDialogForm = (props) => {
  const {
    trackingGroups,
    setDialogOpen,
    open,
    selectedHotspot,
    setSnackOpen,
    setError,
    setSuccess,
  } = props

  const mapRef = useRef()

  const [hotspotName, setHotspotName] = useState('')
  const [selectedGroups, setSelectedGroups] = useState([])
  const [newGroups, setNewGroups] = useState([])
  const [location, setLocation] = useState('')
  const [lat, setlat] = useState(28.6077159025)
  const [long, setlong] = useState(77.224249103)
  const [zipCode, setZipCode] = useState(0)
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 400,
    latitude: lat,
    longitude: long,
    zoom: 15,
  })
  const [isFetching, setIsFetching] = useState(false)

  const dispatch = useDispatch()

  useEffect(() => {
    if (Object.entries(selectedHotspot).length !== 0) {
      setHotspotName(selectedHotspot.hotspotName)
      const groups = selectedHotspot.groups

      const arr = []
      groups.forEach((x) => arr.push(x._id))
      setSelectedGroups(arr)

      getLatLong(
        selectedHotspot.location.latitude,
        selectedHotspot.location.longitude,
      )
      setViewport({
        ...viewport,
        latitude: selectedHotspot.location.latitude,
        longitude: selectedHotspot.location.longitude,
      })
      setlat(selectedHotspot.location.latitude)
      setlong(selectedHotspot.location.longitude)
    }
  }, [selectedHotspot])

  // useEffect(() => {
  //   const arr = []
  //   selectedGroups.forEach((x) => {
  //     const d = trackingGroups.filter((item) => item.id === x)[0]
  //     const data = {
  //       groupName: d.groupName,
  //       id: d.id,
  //     }
  //     arr.push(data)
  //   })

  //   setNewGroups(arr)
  // }, [selectedGroups])

  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    [],
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
      .get(`${API_SERVICE}/getlatlong/${latitude}/${longitude}`)
      .then((res) => {
        setLocation(res.data.formattedAddress)
        setZipCode(res.data.zipcode)
        setIsFetching(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const handleChange = (event) => {
    const {
      target: { value },
    } = event
    setSelectedGroups(typeof value === 'string' ? value.split(',') : value)
  }

  const updateDetails = () => {
    const body = {
      _id: selectedHotspot._id,
      hotspotName,
      location: {
        latitude: Number(lat.toPrecision(6)),
        longitude: Number(long.toPrecision(6)),
        zipCode,
      },
      groups: selectedGroups,
    }
    dispatch(updateHotspot(body))
    setDialogOpen(false)
  }

  // const updateHotspot = () => {
  //   const ref = doc(db, 'trackingHotspots', selectedHotspot.id)
  //   updateDoc(ref, {
  //     hotspotName,
  //     groups: newGroups,
  //     groupId: selectedGroups,
  //     location: { lat, long, zipCode },
  //   })
  //     .then(() => {
  //       selectedHotspot.groups.forEach(({ id }) => {
  //         const groupRef = doc(db, 'trackingGroups', id)
  //         updateDoc(groupRef, {
  //           hotspot: arrayRemove({
  //             hotspotName: selectedHotspot.hotspotName,
  //             id: selectedHotspot.id,
  //             location: {
  //               lat: Number(selectedHotspot.location.lat.toPrecision(6)),
  //               long: Number(selectedHotspot.location.long.toPrecision(6)),
  //               zipCode: selectedHotspot.location.zipCode,
  //             },
  //           }),
  //         }).catch((error) => console.log(error))
  //       })

  //       selectedGroups.forEach((id) => {
  //         const groupRef = doc(db, 'trackingGroups', id)
  //         updateDoc(groupRef, {
  //           hotspot: arrayRemove({
  //             hotspotName: selectedHotspot.hotspotName,
  //             id: selectedHotspot.id,
  //             location: {
  //               lat: Number(selectedHotspot.location.lat.toPrecision(6)),
  //               long: Number(selectedHotspot.location.long.toPrecision(6)),
  //               zipCode: selectedHotspot.location.zipCode,
  //             },
  //           }),
  //         }).catch((error) => console.log(error))
  //         updateDoc(groupRef, {
  //           hotspot: arrayUnion({
  //             hotspotName,
  //             id: selectedHotspot.id,
  //             location: {
  //               lat: Number(lat.toPrecision(6)),
  //               long: Number(long.toPrecision(6)),
  //               zipCode: selectedHotspot.location.zipCode,
  //             },
  //           }),
  //         }).catch((error) => console.log(error))
  //       })
  //     })
  //     .then(() => {
  //       setSuccess('Details Updated Successfully')
  //       setSnackOpen(true)
  //       setDialogOpen(false)
  //     })
  //     .catch((error) => {
  //       setError(error.message)
  //       setSnackOpen(true)
  //       setDialogOpen(false)
  //     })
  // }

  return (
    <Dialog open={open} onClose={() => setDialogOpen(false)}>
      <DialogContent sx={{ width: '1200' }}>
        <form noValidate style={{ marginBottom: '20px' }}>
          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="hotspotName"
            label="Hotspot Name"
            name="hotspotName"
            autoFocus
            value={hotspotName}
            onChange={(e) => setHotspotName(e.target.value)}
          />

          <FormControl margin="normal" fullWidth variant="outlined">
            <InputLabel id="device-group">Select Group</InputLabel>
            <Select
              labelId="device-group"
              label="Select Group"
              value={selectedGroups}
              onChange={handleChange}
              multiple
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {trackingGroups.map((item) => (
                <MenuItem key={item._id} value={item._id}>
                  <Checkbox checked={selectedGroups.indexOf(item._id) > -1} />
                  <ListItemText primary={item.groupName} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            variant="outlined"
            margin="normal"
            fullWidth
            id="location"
            label="Set Location"
            name="location"
            value={location}
            onChange={(e) => {}}
          />
        </form>
        <ReactMapGL
          {...viewport}
          ref={mapRef}
          mapboxApiAccessToken="pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw"
          mapStyle="mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63"
          onViewportChange={(nextViewport) => setViewport(nextViewport)}
          onClick={async (e) => {
            setlat(e.lngLat[1])
            setlong(e.lngLat[0])
            setIsFetching(true)
            getLatLong(e.lngLat[1], e.lngLat[0])
          }}
        >
          <Geocoder
            mapRef={mapRef}
            onViewportChange={handleGeocoderViewportChange}
            mapboxApiAccessToken="pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw"
            position="top-left"
            marker={true}
            countries="IN"
            reverseGeocode={true}
          />
          <Marker key="1" latitude={lat} longitude={long}>
            <button className="marker-btn">
              <img
                alt="Image"
                src="https://www.nbp.co.uk/Content/Images/uploaded/contact-branch-details.png"
              />
            </button>
          </Marker>
        </ReactMapGL>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
        <Button disabled={isFetching} onClick={() => updateDetails()}>
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default EditHotspotDialogForm
