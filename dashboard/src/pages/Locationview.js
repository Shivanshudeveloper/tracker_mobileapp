import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Typography } from '@material-ui/core'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import Firebase, { firestore, database } from '../Firebase/index'
import axios from 'axios'

import { API_SERVICE } from '../URI'

const Locationview = (props) => {
  const { userForm } = props
  const { phoneNumber, email, senderId } = userForm

  const [lat, setlat] = useState(28.568911)
  const [long, setlong] = useState(77.16256)
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 500,
    latitude: lat,
    longitude: long,
    zoom: 15,
  })

  const [selected, setSelected] = useState(false)
  const [selectedLat, setSelectedLat] = useState(null)
  const [selectedLong, setSelectedLong] = useState(null)
  const [userlocationdata, setuserlocationdata] = useState({})
  const [requestPending, setRequestPending] = useState(true)
  const [requestAccepted, setRequestAccepted] = useState(false)
  const [requestRejected, setRequestRejected] = useState(false)

  const getLongLat = (lat, long) => {
    axios
      .get(`${API_SERVICE}/api/v1/main/getlatlong/${lat}/${long}`)
      .then((response) => {
        setuserlocationdata(response.data)
      })
      .catch((err) => console.log(err))
  }

  const addLocationToDB = async (latitude, longitude) => {
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
    if (userForm !== undefined && userForm !== null) {
      const requestRef = firestore
        .collection('trackingRequest')
        .doc(phoneNumber)
      requestRef.onSnapshot((snapshot) => {
        if (snapshot.exists) {
          const reqList = snapshot.data().requestList
          const thisReq = reqList.filter((req) => req.senderId === senderId)[0]
          if (thisReq !== undefined) {
            if (thisReq.requestAccepted === true) {
              setRequestAccepted(true)
              setRequestPending(false)
              addNotification(
                `${userForm.fullName} has accepted your tracking request`,
                'accepted'
              )
            } else if (thisReq.requestPending === true) {
              setRequestPending(true)
              setRequestAccepted(false)
              setRequestRejected(false)
              addNotification(
                `Request has been sent to ${userForm.fullName}`,
                'sent'
              )
            } else if (thisReq.requestRejected === true) {
              setRequestRejected(true)
              addNotification(
                `${userForm.fullName} has decline your request`,
                'rejected'
              )
            }
          }
        }
      })
    }
  }, [userForm])

  const addNotification = (message, status) => {
    const notificationRef = firestore
      .collection('trackingNotifications')
      .doc(senderId)

    let pending = false
    let accept = false
    let reject = false

    if (status === 'accepted') {
      accept = true
    } else if (status === 'sent') {
      pending = true
    } else if (status === 'rejected') {
      reject = true
    }

    notificationRef.get().then((doc) => {
      if (doc.exists) {
        notificationRef
          .update({
            notificationList: Firebase.firestore.FieldValue.arrayUnion({
              name: userForm.fullName,
              message,
              phoneNumber,
              requestPending: pending,
              requestAccepted: accept,
              requestRejected: reject,
            }),
          })
          .catch((error) => console.log(error))
      } else {
        notificationRef
          .set({
            notificationList: Firebase.firestore.FieldValue.arrayUnion({
              name: userForm.fullName,
              message,
              phoneNumber,
              requestPending: pending,
              requestAccepted: accept,
              requestRejected: reject,
            }),
          })
          .catch((error) => console.log(error))
      }
    })
  }

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
              mapboxApiAccessToken='sk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNreDVxN2IycDBoc3YycG56cHpyZ3pheGUifQ.ar9eBGxcdKwHrCyzg82BbQ'
              mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
              onViewportChange={(nextViewport) => setViewport(nextViewport)}
            >
              <Marker key='India Gate1' latitude={lat} longitude={long}>
                <button
                  className='marker-btn'
                  onClick={(e) => {
                    e.preventDefault()
                    setSelected(true)
                    setSelectedLat(lat)
                    setSelectedLong(long)
                  }}
                >
                  <img
                    alt='Image'
                    src='https://img.icons8.com/color/48/000000/map-pin.png'
                  />
                </button>
              </Marker>
              {selected ? (
                <Popup
                  latitude={selectedLat}
                  longitude={selectedLong}
                  onClose={() => {
                    setSelected(false)
                    setSelectedLat(28.5793)
                    setSelectedLong(77.321)
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

          {requestPending &&
            requestAccepted === false &&
            requestRejected === false && (
              <Typography
                sx={{ margin: 10, textAlign: 'center' }}
                component='h1'
              >
                Tracking request is in pending
              </Typography>
            )}

          {requestRejected && (
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
