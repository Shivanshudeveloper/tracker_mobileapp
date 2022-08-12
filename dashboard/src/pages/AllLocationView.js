import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Avatar, Box, Container, Typography } from '@mui/material'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import LocationTimeline from '../components/dashboard/LocationTimeline'

import { API_SERVICE, MAP_STYLE, MAP_TOKEN } from '../URI'

const AllLocationView = (props) => {
    const { userList, senderId, trackingList } = props

    const [selected, setSelected] = useState(false)
    const [selectedLat, setSelectedLat] = useState(null)
    const [selectedLong, setSelectedLong] = useState(null)
    const [selectedLocation, setSelectedLocation] = useState(0)
    const [selectedDevice, setSelectedDevice] = useState('')
    const [userlocationdata, setuserlocationdata] = useState({})
    const [lat, setlat] = useState(28.598)
    const [long, setlong] = useState(77.3)
    const [load, setLoad] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [locations, setLocations] = useState([])
    const [trackingData, setTrackingData] = useState([])

    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: lat,
        longitude: long,
        zoom: 11,
    })

    useEffect(() => {
        const data = []
        trackingList.forEach((list) => {
            userList.forEach((item) => {
                if (list.phoneNumber === item.phoneNumber) {
                    list['location'] = item.location
                    data.push(list)
                }
            })
        })
        console.log(data)

        setTrackingData(data)
    }, [trackingList, userList])

    useEffect(async () => {
        setLoad(true)
        axios
            .get(`${API_SERVICE}/getlatlong/${selectedLat}/${selectedLong}`)
            .then((response) => {
                setuserlocationdata(response.data)
                setLoad(false)
            })
            .catch((err) => console.log(err))
    }, [selectedLat, selectedLong])

    useEffect(async () => {
        if (selectedDevice.length === 0) {
            return
        }
        try {
            const { data } = await axios.get(
                `${API_SERVICE}/get/location/${senderId}/${selectedDevice}/${
                    new Date().getMonth() + 1
                }`
            )

            setLocations(data)
        } catch (error) {
            console.log(error.message)
        }
    }, [selectedDevice])

    const handleShowDetails = (user) => {
        if (showDetails) {
            setShowDetails(false)
            setViewport({ ...viewport, width: '100%' })
        } else {
            setShowDetails(true)
            setViewport({ ...viewport, width: '100%' })
            setSelectedDevice(user.phoneNumber)
        }
    }

    const getInitials = (name) => {
        const arr = name.split(' ')
        let initials
        if (arr.length === 1) {
            initials = arr[0].split('')[0].toUpperCase()
        } else {
            initials =
                arr[0].split('')[0].toUpperCase() +
                arr[1].split('')[0].toUpperCase()
        }

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
                <Container maxWidth={true} sx={{ height: '100' }}>
                    <ReactMapGL
                        {...viewport}
                        mapboxApiAccessToken={MAP_TOKEN}
                        mapStyle={MAP_STYLE}
                        onViewportChange={(nextViewport) =>
                            setViewport(nextViewport)
                        }
                    >
                        {trackingData.map((user, index) => (
                            <Marker
                                key={user.phoneNumber}
                                latitude={user.location.latitude}
                                longitude={user.location.longitude}
                            >
                                <button
                                    className='marker-btn'
                                    onMouseEnter={(e) => {
                                        e.preventDefault()
                                        setSelected(true)
                                        setSelectedLat(user.location.latitude)
                                        setSelectedLong(user.location.longitude)
                                        setlat(user.location.latitude)
                                        setlong(user.location.longitude)

                                        setSelectedLocation(index)
                                    }}
                                    onMouseLeave={(e) => {
                                        e.preventDefault()
                                        setSelected(false)
                                    }}
                                    onClick={() => handleShowDetails(user)}
                                >
                                    <Avatar sx={{ backgroundColor: 'orange' }}>
                                        {getInitials(user.fullName)}
                                    </Avatar>
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
                                    <h2
                                        style={{
                                            textAlign: 'center',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        {
                                            trackingData[selectedLocation]
                                                .fullName
                                        }
                                    </h2>
                                    {load ? (
                                        <p>Fetching Location ...</p>
                                    ) : (
                                        <p>
                                            {userlocationdata.formattedAddress}
                                        </p>
                                    )}
                                </div>
                            </Popup>
                        ) : null}
                    </ReactMapGL>
                </Container>
                {showDetails && (
                    <Box
                        className='location-history'
                        sx={{
                            width: 400,
                            display: 'flex',
                            justifyContent: 'flex-start',
                            height: '82vh',
                            overflowY: 'scroll',
                        }}
                    >
                        {locations.length !== 0 ? (
                            <LocationTimeline locations={locations} />
                        ) : (
                            <Box
                                sx={{
                                    width: 300,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography component='h5' variant='h5'>
                                    No History Found
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </>
    )
}

export default React.memo(AllLocationView)
