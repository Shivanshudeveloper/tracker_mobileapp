import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Box, Container, Typography } from '@material-ui/core'
import { database } from '../Firebase/index'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'

import { API_SERVICE } from '../URI'

const AllLocationView = (props) => {
  const { userForms } = props
  const userForm = userForms[0]

  const [lat, setlat] = useState(28.568911)
  const [long, setlong] = useState(77.16256)

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
  const [selectedLocation, setSelectedLocation] = useState(0)
  const [userlocationdata, setuserlocationdata] = useState({})

  const getLongLat = (lat, long) => {
    axios
      .get(`${API_SERVICE}/api/v1/main/getlatlong/${lat}/${long}`)
      .then((response) => {
        setuserlocationdata(response.data)
      })
      .catch((err) => console.log(err))
  }

  // getting locaion of user
  // right now we have only one user, later will will listen changes for every user in user list
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
        zoom: 14,
      })
      setlat(data.lat)
      setlong(data.long)
      getLongLat(data.lat, data.long)
    })
  }, [])

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
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
            mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
          >
            {userForms.map((x) => (
              <Marker key={x.email} latitude={lat} longitude={long}>
                <button
                  className='marker-btn'
                  onClick={(e) => {
                    e.preventDefault()
                    setSelected(true)
                    setSelectedLat(lat)
                    setSelectedLong(long)
                    setSelectedLocation(0)
                  }}
                >
                  <img
                    alt='Image'
                    src='https://img.icons8.com/color/48/000000/map-pin.png'
                  />
                </button>
              </Marker>
            ))}
            <Marker key='dumy1' latitude={28.5893} longitude={77.311}>
              <button
                className='marker-btn'
                onClick={(e) => {
                  e.preventDefault()
                  setSelected(true)
                  setSelectedLat(28.5893)
                  setSelectedLong(77.311)
                  setSelectedLocation(1)
                }}
              >
                <img
                  alt='Image'
                  src='https://img.icons8.com/color/48/000000/map-pin.png'
                />
              </button>
            </Marker>
            <Marker key='dumy2' latitude={28.5993} longitude={77.321}>
              <button
                className='marker-btn'
                onClick={(e) => {
                  e.preventDefault()
                  setSelected(true)
                  setSelectedLat(28.5993)
                  setSelectedLong(77.321)
                  setSelectedLocation(2)
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
                  setSelectedLat(0)
                  setSelectedLong(0)
                }}
              >
                <div>
                  <h2 style={{ textAlign: 'center' }}>
                    {userForms[selectedLocation].fullName}
                  </h2>
                  <p>{userlocationdata.formattedAddress}</p>
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
        </Container>
      </Box>
    </>
  )
}

export default AllLocationView
