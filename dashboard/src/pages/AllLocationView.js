import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Avatar, Box, Container, Typography } from '@mui/material'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import LocationTimeline from '../components/dashboard/LocationTimeline'

import { API_SERVICE } from '../URI'

const AllLocationView = (props) => {
  const { userList } = props

  const [selected, setSelected] = useState(false)
  const [selectedLat, setSelectedLat] = useState(null)
  const [selectedLong, setSelectedLong] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(0)
  const [userlocationdata, setuserlocationdata] = useState({})
  const [lat, setlat] = useState(28.598)
  const [long, setlong] = useState(77.3)
  const [imgUri, setImgUri] = useState('')
  const [load, setLoad] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const [viewport, setViewport] = useState({
    width: '100%',
    height: 800,
    latitude: lat,
    longitude: long,
    zoom: 11,
  })

  useEffect(async () => {
    setLoad(true)
    axios
      .get(
        `${API_SERVICE}/api/v1/main/getlatlong/${selectedLat}/${selectedLong}`
      )
      .then((response) => {
        setuserlocationdata(response.data)
        setLoad(false)
      })
      .catch((err) => console.log(err))
  }, [selectedLat, selectedLong])

  const handleShowDetails = () => {
    if (showDetails) {
      setShowDetails(false)
      setViewport({ ...viewport, width: '100%' })
    } else {
      setShowDetails(true)
      setViewport({ ...viewport, width: '100%' })
    }
  }

  const getInitials = (name) => {
    const arr = name.split(' ')
    const initials =
      arr[0].split('')[0].toUpperCase() + arr[1].split('')[0].toUpperCase()

    return initials
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
          display: 'flex',
        }}
      >
        <Container maxWidth={true}>
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
            mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
            onViewportChange={(nextViewport) => setViewport(nextViewport)}
          >
            {userList.map((user, index) => (
              <Marker
                key={user.phoneNumber}
                latitude={user.liveLocation.latitude}
                longitude={user.liveLocation.longitude}
              >
                <button
                  className='marker-btn'
                  onMouseEnter={(e) => {
                    e.preventDefault()
                    setSelected(true)
                    setSelectedLat(user.liveLocation.latitude)
                    setSelectedLong(user.liveLocation.longitude)
                    setlat(user.liveLocation.latitude)
                    setlong(user.liveLocation.longitude)

                    setSelectedLocation(index)
                  }}
                  onMouseLeave={(e) => {
                    e.preventDefault()
                    setSelected(false)
                  }}
                  onClick={handleShowDetails}
                >
                  <Avatar sx={{ backgroundColor: 'orange' }}></Avatar>
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
                  <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>
                    {userList[selectedLocation].name}
                  </h2>
                  {load ? (
                    <p>Fetching Location ...</p>
                  ) : (
                    <p>{userlocationdata.formattedAddress}</p>
                  )}
                </div>
              </Popup>
            ) : null}
          </ReactMapGL>
        </Container>
        {showDetails && (
          <Box
            sx={{ width: 400, display: 'flex', justifyContent: 'flex-start' }}
          >
            <LocationTimeline />
          </Box>
        )}
      </Box>
    </>
  )
}

export default React.memo(AllLocationView)
