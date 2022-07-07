import React, { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { Avatar, Box, Container, Typography } from '@mui/material'
import ReactMapGL, { Marker, Popup } from 'react-map-gl'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import { db } from '../Firebase/index'
import {
    collection,
    doc,
    limit,
    onSnapshot,
    orderBy,
    query,
    where,
} from 'firebase/firestore'
import LocationTimeline from '../components/dashboard/LocationTimeline'

const Locationview = (props) => {
    const { user } = props
    const { phoneNumber, createdBy } = user

    console.log(user, phoneNumber, createdBy)

    const [lat, setlat] = useState(0)
    const [long, setlong] = useState(0)
    const [viewport, setViewport] = useState({
        width: '100%',
        height: '100%',
        latitude: lat,
        longitude: long,
        zoom: 15,
    })

    const [selected, setSelected] = useState(false)
    const [selectedLat, setSelectedLat] = useState(null)
    const [selectedLong, setSelectedLong] = useState(null)
    const [userlocationdata, setuserlocationdata] = useState({})
    const [imgUri, setImgUri] = useState('')
    const [load, setLoad] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [locations, setLocations] = useState([])

    useEffect(async () => {
        setLoad(true)
        if (lat === 0 || long === 0) {
            return
        }
        axios
            .get(`${API_SERVICE}/getlatlong/${selectedLat}/${selectedLong}`)
            .then((response) => {
                console.log('SETTING DATA')
                setuserlocationdata(response.data)
                setLoad(false)
            })
            .catch((err) => console.log(err))
    }, [selectedLat, selectedLong])

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
    }, [phoneNumber])

    // useEffect(() => {
    //   if (user !== undefined && user !== null) {
    //     const requestRef = doc(db, 'trackingRequest', phoneNumber)

    //     const unsub = onSnapshot(requestRef, (doc) => {
    //       if (doc.exists()) {
    //         const reqList = doc.data().requestList
    //         const thisReq = reqList.filter((req) => req.sender.id === createdBy)[0]
    //         if (thisReq !== undefined) {
    //           if (thisReq.requestStatus === 'accepted') {
    //             setRequestStatus('accepted')
    //           } else if (thisReq.requestStatus === 'pending') {
    //             setRequestStatus('pending')
    //           } else if (thisReq.requestStatus === 'rejected') {
    //             setRequestStatus('rejected')
    //           }
    //         }
    //       }
    //     })

    //     return () => unsub()
    //   }
    // }, [phoneNumber, createdBy])

    useEffect(async () => {
        try {
            const { data } = await axios.get(
                `${API_SERVICE}/get/location/${createdBy}/${phoneNumber}`
            )

            setLocations(data)
        } catch (error) {
            console.log(error.message)
        }
    }, [user])

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
                <Container maxWidth={true} sx={{ px: 0, height: '100' }}>
                    {user.trackingStatus === 'accepted' && (
                        <ReactMapGL
                            {...viewport}
                            mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
                            mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
                            onViewportChange={(nextViewport) =>
                                setViewport(nextViewport)
                            }
                        >
                            <Marker
                                key='India Gate1'
                                latitude={lat}
                                longitude={long}
                            >
                                <button
                                    className='marker-btn'
                                    onMouseEnter={(e) => {
                                        e.preventDefault()
                                        setSelected(true)
                                        setSelectedLat(lat)
                                        setSelectedLong(long)
                                    }}
                                    onMouseLeave={(e) => {
                                        e.preventDefault()
                                        setSelected(false)
                                    }}
                                    onClick={handleShowDetails}
                                >
                                    <Avatar
                                        src={imgUri}
                                        sx={{
                                            backgroundColor: 'orange',
                                        }}
                                    >
                                        {getInitials(user.fullName)}
                                    </Avatar>
                                </button>
                            </Marker>
                            {selected ? (
                                <Popup
                                    latitude={selectedLat}
                                    longitude={selectedLong}
                                >
                                    <div>
                                        <h2 style={{ textAlign: 'center' }}>
                                            {user.fullName}
                                        </h2>
                                        {load ? (
                                            <p>Fetching Location ...</p>
                                        ) : (
                                            <p>
                                                {
                                                    userlocationdata.formattedAddress
                                                }
                                            </p>
                                        )}
                                    </div>
                                </Popup>
                            ) : null}
                        </ReactMapGL>
                    )}

                    {user.trackingStatus === 'pending' && (
                        <Typography
                            sx={{ margin: 10, textAlign: 'center' }}
                            component='h1'
                        >
                            Tracking request is in pending
                        </Typography>
                    )}

                    {user.trackingStatus === 'rejected' && (
                        <Box sx={{ position: 'relative' }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    zIndex: 1000,
                                    backgroundColor: '#f5f5f5',
                                    borderRadius: 25,
                                    right: '50%',
                                    bottom: '30px',
                                    transform: 'translate(50%)',
                                    px: 2,
                                }}
                            >
                                <Typography
                                    sx={{
                                        margin: 2,
                                        textAlign: 'center',
                                        color: 'red',
                                        fontWeight: 'bold',
                                    }}
                                    component='h1'
                                >
                                    Tracking request is rejected
                                </Typography>
                            </Box>

                            <ReactMapGL
                                {...viewport}
                                mapboxApiAccessToken='pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
                                mapStyle='mapbox://styles/shivanshu981/ckvrknxuq05w515pbotlkvj63'
                                onViewportChange={(nextViewport) =>
                                    setViewport(nextViewport)
                                }
                            >
                                <Marker
                                    key='India Gate1'
                                    latitude={lat}
                                    longitude={long}
                                >
                                    <button
                                        className='marker-btn'
                                        onMouseEnter={(e) => {
                                            e.preventDefault()
                                            setSelected(true)
                                            setSelectedLat(lat)
                                            setSelectedLong(long)
                                        }}
                                        onMouseLeave={(e) => {
                                            e.preventDefault()
                                            setSelected(false)
                                        }}
                                        onClick={handleShowDetails}
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
                                    >
                                        <div>
                                            <h2 style={{ textAlign: 'center' }}>
                                                {user.fullName}
                                            </h2>
                                            {load ? (
                                                <p>Fetching Location ...</p>
                                            ) : (
                                                <p>
                                                    {
                                                        userlocationdata.formattedAddress
                                                    }
                                                </p>
                                            )}
                                        </div>
                                    </Popup>
                                ) : null}
                            </ReactMapGL>
                        </Box>
                    )}
                </Container>
                {showDetails && (
                    <Box
                        sx={{
                            width: 400,
                            display: 'flex',
                            justifyContent: 'flex-start',
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

export default React.memo(Locationview)
