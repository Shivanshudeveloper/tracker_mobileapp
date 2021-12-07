import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Typography } from '@material-ui/core'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import { makeStyles } from '@material-ui/styles'
import { red } from '@material-ui/core/colors'
import { database } from '../Firebase/index'
import axios from 'axios'

import { API_SERVICE } from '../URI'

const Locationview = (props) => {
  const [lat, setlat] = useState(28.568911)
  const [long, setlong] = useState(77.16256)

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: lat,
    longitude: long,
    zoom: 15,
  })

  const [selectedPark, setSelectedPark] = useState(null)
  const [userlocationdata, setuserlocationdata] = useState({})
  const [requestPending, setRequestPending] = useState(true)
  const [requestAccepted, setRequestAccepted] = useState(false)

  const { userForm } = props
  const { requestId, phoneNumber, email } =
    userForm !== undefined ? userForm : { requestId: '', phoneNumber: '' }

  const getLongLat = (lat, long) => {
    axios
      .get(`${API_SERVICE}/api/v1/main/getlatlong/${lat}/${long}`)
      .then((response) => {
        setuserlocationdata(response.data)
      })
      .catch((err) => console.log(err))
  }

  const addLocationToDB = async (latitude, longitude) => {
    console.log('Iam an running')
    let hotspot = ''
    await axios
      .get(`${API_SERVICE}/api/v1/main/getlatlong/${latitude}/${longitude}`)
      .then((response) => {
        const { data } = response
        hotspot = data.formattedAddress
      })
      .catch((err) => console.log(err))

    if (hotspot !== '') {
      const config = {
        headers: {
          'Content-Types': 'application/json',
        },
      }

      const body = {
        email,
        phoneNumber,
        fullName: userForm.fullName,
        hotspot,
      }

      await axios
        .post(`${API_SERVICE}/api/v1/main/tracker/userLocation`, body, config)
        .catch((error) => console.log(error))
    }
  }

  useEffect(() => {
    var starCountRef = database.ref('trackerapp/testuser')
    starCountRef.on('value', (snapshot) => {
      const data = snapshot.val()
      // setalldata([data.work]);
      setViewport({
        width: '100%',
        height: 800,
        latitude: data.lat,
        longitude: data.long,
        zoom: 15,
      })
      setlat(data.lat)
      setlong(data.long)
      getLongLat(data.lat, data.long)
      addLocationToDB(data.lat, data.long)
    })
  }, [])

  useEffect(() => {
    if (userForm !== undefined) {
      const requestRef = database.ref(
        `trackerapp/trackingRequested/${phoneNumber}/${requestId}`
      )

      requestRef.on('value', (snapshot) => {
        if (snapshot !== null && snapshot.exists()) {
          const data = snapshot.val()
          if (data.requestPending === true) {
            setRequestPending(true)
          }
        }
      })

      const acceptRef = database.ref(
        `trackerapp/trackingAccepted/${phoneNumber}/${requestId}`
      )

      acceptRef.on('value', (snapshot) => {
        if (snapshot !== null && snapshot.exists()) {
          const data = snapshot.val()
          if (data.requestAccepted === true) {
            setRequestAccepted(true)
            setRequestPending(false)
          }
        }
      })

      acceptRef.get().then((res) => {
        const data = res.val()
        console.log(data)
        setRequestAccepted(data.requestAccepted)
        setRequestPending(!data.requestAccepted)
      })
    }
  }, [userForm])

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
        }}
      >
        <Container maxWidth={true}>
          {requestAccepted && requestPending === false && (
            <ReactMapGL
              {...viewport}
              mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
              mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
            >
              <Marker key='India Gate1' latitude={lat} longitude={long}>
                <button
                  className='marker-btn'
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedPark('W')
                  }}
                >
                  <img
                    alt='Image'
                    src='https://img.icons8.com/color/48/000000/map-pin.png'
                  />
                </button>
              </Marker>

              {selectedPark ? (
                <Popup
                  latitude={lat}
                  longitude={long}
                  onClose={() => {
                    setSelectedPark(null)
                  }}
                >
                  <div>
                    <h2 style={{ textAlign: 'center' }}>{userForm.fullName}</h2>
                    <p>{userlocationdata.formattedAddress}</p>
                  </div>
                </Popup>
              ) : null}
            </ReactMapGL>
          )}

          {requestPending && requestAccepted === false && (
            <Typography sx={{ margin: 10, textAlign: 'center' }} component='h1'>
              Tracking request is in pending
            </Typography>
          )}

          {requestPending === false && requestAccepted === false && (
            <Typography sx={{ margin: 10, textAlign: 'center' }} component='h1'>
              Tracking request is rejected
            </Typography>
          )}
        </Container>
      </Box>
    </>
  )
}

export default Locationview
