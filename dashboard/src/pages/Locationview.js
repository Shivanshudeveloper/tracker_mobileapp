import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Avatar, Box, Container, Typography } from '@material-ui/core'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import { db } from '../Firebase/index'
import { doc, onSnapshot } from 'firebase/firestore'

const Locationview = (props) => {
  const { userList } = props
  const { phoneNumber, senderId } = userList

  const [lat, setlat] = useState(0)
  const [long, setlong] = useState(0)
  const [viewport, setViewport] = useState({
    width: '100%',
    height: 800,
    latitude: lat,
    longitude: long,
    zoom: 15,
  })

  const [selected, setSelected] = useState(false)
  const [selectedLat, setSelectedLat] = useState(null)
  const [selectedLong, setSelectedLong] = useState(null)
  const [userlocationdata, setuserlocationdata] = useState({})
  const [requestStatus, setRequestStatus] = useState('')
  const [imgUri, setImgUri] = useState('')
  const [load, setLoad] = useState(false)

  useEffect(async () => {
    setLoad(true)
    if (lat === 0 || long === 0) {
      return
    }
    axios
      .get(`${API_SERVICE}/api/v1/main/getlatlong/${lat}/${long}`)
      .then((response) => {
        setuserlocationdata(response.data)
        setLoad(false)
      })
      .catch((err) => console.log(err))
  }, [lat, long])

  useEffect(() => {
    var userRef = doc(db, 'trackerAndroidUser', phoneNumber)

    const unsub = onSnapshot(userRef, (document) => {
      if (document.exists()) {
        const data = document.data()
        setViewport({
          width: '100%',
          height: 800,
          latitude: data.liveLocation.latitude,
          longitude: data.liveLocation.longitude,
          zoom: 15,
        })
        setlat(data.liveLocation.latitude)
        setlong(data.liveLocation.longitude)
        setImgUri(data.profilePicture)
      }
    })

    return () => unsub()
  }, [])

  useEffect(() => {
    if (userList !== undefined && userList !== null) {
      const requestRef = doc(db, 'trackingRequest', phoneNumber)

      return onSnapshot(requestRef, (doc) => {
        if (doc.exists()) {
          const reqList = doc.data().requestList
          const thisReq = reqList.filter((req) => req.senderId === senderId)[0]

          if (thisReq !== undefined) {
            if (thisReq.requestStatus === 'accepted') {
              setRequestStatus('accepted')
            } else if (thisReq.requestStatus === 'pending') {
              setRequestStatus('pending')
            } else if (thisReq.requestStatus === 'rejected') {
              setRequestStatus('rejected')
            }
          }
        }
      })
    }
  }, [userList])

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
          {requestStatus === 'accepted' && (
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
                    setSelected(true)
                    setSelectedLat(lat)
                    setSelectedLong(long)
                  }}
                >
                  <Avatar
                    src={imgUri}
                    sx={{
                      backgroundColor: 'orange',
                    }}
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
                    <h2 style={{ textAlign: 'center' }}>{userList.fullName}</h2>
                    {load ? (
                      <p>Fetching Location ...</p>
                    ) : (
                      <p>{userlocationdata.formattedAddress}</p>
                    )}
                  </div>
                </Popup>
              ) : null}
            </ReactMapGL>
          )}

          {requestStatus === 'pending' && (
            <Typography sx={{ margin: 10, textAlign: 'center' }} component='h1'>
              Tracking request is in pending
            </Typography>
          )}

          {requestStatus === 'rejected' && (
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
