import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
    View,
    StyleSheet,
    useColorScheme,
    FlatList,
    SafeAreaView,
    Dimensions,
    LogBox,
} from 'react-native'
import { Button, Title } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import Colors from '../constants/Colors'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import RequestComponent from '../Components/RequestComponent'
import MapView, { Marker } from 'react-native-maps'
import moment from 'moment'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import * as BackgroundFetch from 'expo-background-fetch'

const WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

let LAT = 0
let LON = 0

const LOCATION_TASK_NAME = 'background-location-task'

TaskManager.defineTask(LOCATION_TASK_NAME, async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    console.log('43 Here')

    if (status === 'granted') {
        await Location.requestBackgroundPermissionsAsync()
        console.log('47 Here')

        let location = await Location.getCurrentPositionAsync({})
        console.log(location)
    }

    // const latitude = Number(locations[0].coords.latitude.toPrecision(6))
    // const longitude = Number(locations[0].coords.longitude.toPrecision(6))

    // LAT = latitude
    // LON = longitude

    return BackgroundFetch.BackgroundFetchResult.NewData
})

const _getLocationPermission = async () => {
    console.log('60 Here')
    return BackgroundFetch.registerTaskAsync(LOCATION_TASK_NAME, {
        minimumInterval: 10 * 1,
        stopOnTerminate: false,
        startOnBoot: true,
    })
}

const HomeScreen = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [lon, setLon] = useState(77.3021)
    const [lat, setLat] = useState(28.5971)
    const [requestList, setRequestList] = useState([])
    const [hotspotList, setHotspotList] = useState([])
    const [region, setRegion] = useState({
        latitude: lat,
        latitudeDelta: 0.010404038532286108,
        longitude: lon,
        longitudeDelta: 0.01820448786020279,
    })
    const [lastAddres, setLastAddress] = useState('')
    const [lastLat, setLastLat] = useState(0)
    const [lastLong, setLastLong] = useState(0)
    const [attendanceMarked, setAttendanceMarked] = useState(false)

    LogBox.ignoreLogs([
        'Setting a timer',
        'Warning: Failed prop type: The prop',
    ])

    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const color = Colors[colorScheme]
    const { currentUser } = auth
    let { phoneNumber } = currentUser
    phoneNumber = phoneNumber.slice(3)

    useEffect(() => {
        const setLatAndLon = async () => {
            setLat(LAT)
            setLon(LON)

            await updateLocationInDB()
            await markAttendanceAndLocation()
        }

        setLatAndLon()
    }, [LAT, LON])

    useEffect(() => {
        _getLocationPermission()
    }, [])

    useEffect(async () => {
        const checkAndSaveUser = async () => {
            const { data } = await axios.get(
                `${API_SERVICE}/get/livelocation/${phoneNumber}`
            )

            if (data) {
                console.log('User Present')
            } else {
                try {
                    const body = {
                        phoneNumber,
                        location: {
                            latitude: 0,
                            longitude: 0,
                        },
                    }
                    const config = {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                    await axios.post(
                        `${API_SERVICE}/create/livelocation`,
                        body,
                        config
                    )
                } catch (error) {
                    console.log(error.message)
                }
            }
        }
        checkAndSaveUser()
    }, [])

    // get hotspots
    useEffect(() => {
        const getHotspots = async () => {
            await axios
                .get(`${API_SERVICE}/get/device/${phoneNumber}`)
                .then((res) => {
                    const { data } = res
                    const hotspots = []
                    data.forEach((device) => {
                        device.groups.forEach((group) => {
                            const arr = group.hotspots.map((x) => ({
                                ...x,
                                schedule: group.schedule,
                                groupId: group._id,
                                device: {
                                    fullName: device.fullName,
                                },
                            }))

                            hotspots.push(...arr)
                        })
                    })

                    setHotspotList(hotspots)
                })
                .catch((error) => console.log(error.message))
        }

        getHotspots()
    }, [])

    // listening for tracking requests
    useEffect(() => {
        const requestRef = collection(
            db,
            'trackingRequest',
            phoneNumber,
            'requests'
        )
        const q = query(requestRef, where('requestStatus', '==', 'pending'))
        const unsub = onSnapshot(q, (documents) => {
            const pendingRequests = []
            documents.forEach((snap) => {
                pendingRequests.push({ ...snap.data(), id: snap.id })
            })
            setRequestList(pendingRequests)
        })

        return () => unsub()
    }, [])

    const updateLocationInDB = async () => {
        if (checkLatAndLong()) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
                const body = {
                    phoneNumber,
                    location: {
                        latitude: lat,
                        longitude: lon,
                    },
                }
                const { data } = await axios.put(
                    `${API_SERVICE}/update/livelocation`,
                    body,
                    config
                )
                setLastLat(data.location.latitude)
                setLastLong(data.location.longitude)
                console.log('Location Updated')
            } catch (error) {
                console.log(error.message)
            }
        } else {
            console.log('SKIPPED')
        }
    }

    const markAttendanceAndLocation = async () => {
        const response = await Location.reverseGeocodeAsync({
            latitude: lat,
            longitude: lon,
        })

        const currZipCode = response[0].postalCode
        const address = `${response[0].name}, ${response[0].district}, ${response[0].subregion}, ${response[0].region}-${currZipCode}, ${response[0].country}`
        const hotspotArr = hotspotList.filter(
            (hotspot) => hotspot.location.zipCode === currZipCode
        )

        for (let hotspot of hotspotArr) {
            const schedule = hotspot.schedule

            var format = 'hh:mm:ss'
            const { time } = schedule
            const currentTime = moment().format('hh:mm:ss')
            const startTime = moment(time.startTime, format).format('hh:mm:ss')
            const endTime = moment(time.endTime, format).format('hh:mm:ss')

            const startDay = WEEK.indexOf(schedule.startDay)
            const endDay = WEEK.indexOf(schedule.endDay)
            const currentDay = moment(rawDate).day()

            const rawDate = new Date()
            const date = moment(new Date(rawDate)).format('DD-MM-YYYY')
            const month = new Date(rawDate).getMonth() + 1
            const year = new Date(rawDate).getFullYear()

            if (
                currentTime.isBetween(startTime, endTime) &&
                checkStartAndEndDay(startDay, endDay, currentDay) &&
                !attendanceMarked
            ) {
                const body = {
                    hotspot: hotspot._id,
                    phoneNumber,
                    device: hotspot.device,
                    createdBy: hotspot.createdBy,
                    date,
                    month,
                    year,
                }

                await markAttendance(body)
            } else {
                console.log('Attendance :: Skipped')
            }

            if (address !== lastAddres && checkLatAndLong()) {
                const body = {
                    group: hotspot.groupId,
                    hotspot: hotspot._id,
                    phoneNumber,
                    createdBy: hotspot.createdBy,
                    address,
                    latitude: lat,
                    longitude: lon,
                    zipCode: currZipCode,
                    month,
                    year,
                }

                await markLocation(body)

                setLastAddress(address)
                setLastLat(lat)
                setLastLong(lon)
            } else {
                console.log('Location :: Skipped')
            }
        }
    }

    const checkLatAndLong = () => {
        console.log('CHECKING', lastLat, lastLong)

        if (lastLat === 0 && lastLong === 0) {
            return true
        } else if (
            lat >= lastLat - 0.0005 &&
            lat <= lastLat + 0.0005 &&
            lon > lastLong - 0.0005 &&
            lon <= lastLong + 0.0005
        ) {
            return false
        } else {
            return true
        }
    }

    const checkStartAndEndDay = async (startDay, endDay, currentDay) => {
        if (currentDay === startDay || currentDay === endDay) {
            return true
        } else if (startDay <= endDay) {
            return startDay < currentDay && currentDay < endDay
        } else {
            if (startDay < currentDay) {
                return currentDay < endDay + 6
            } else {
                return currentDay < endDay
            }
        }
    }

    const markAttendance = async (body) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            await axios.post(`${API_SERVICE}/create/attendance`, body, config)
            console.log('Attendance Marked')
        } catch (error) {
            if (error.message === 'Request failed with status code 403') {
                console.log('Attendance :: Marked')
                setAttendanceMarked(true)
            }
        }
    }
    const markLocation = async (body) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            await axios.post(`${API_SERVICE}/create/location`, body, config)
            console.log('Location :: Marked')
        } catch (error) {
            console.log(error.message)
        }
    }

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const onRegionChange = (reg) => {
        setRegion({ reg })
    }

    return (
        <SafeAreaView style={styles.container}>
            <AppBar
                onPress={openMenu}
                closeMenu={closeMenu}
                menuVisible={menuVisible}
            />
            <View style={{ padding: 10, backgroundColor: color.background }}>
                <Title>Current Activity</Title>
            </View>

            <MapView
                region={region}
                style={styles.map}
                onRegionChange={onRegionChange}
            >
                <Marker coordinate={{ latitude: LAT, longitude: LON }} />
            </MapView>

            <SafeAreaView
                style={[
                    styles.mainContainer,
                    { backgroundColor: color.background },
                ]}
            >
                <Button
                    labelStyle={styles.btnLabelStyle}
                    style={styles.button}
                    mode='contained'
                    onPress={() => navigation.navigate('TrackerList')}
                >
                    See who's tracking you
                </Button>

                <View style={styles.divider}></View>
                {requestList !== [] && (
                    <FlatList
                        data={requestList}
                        renderItem={({ item }) => (
                            <RequestComponent
                                item={item}
                                phoneNumber={phoneNumber}
                            />
                        )}
                        keyExtractor={(_, index) => index}
                    />
                )}
            </SafeAreaView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
    },
    mainContainer: {
        position: 'relative',
        padding: 10,
        paddingTop: 15,
        flex: 1,
    },
    btnLabelStyle: {
        paddingVertical: 7,
    },
    divider: {
        height: 1,
        backgroundColor: 'grey',
        marginVertical: 10,
    },
    map: {
        width: Dimensions.get('window').width,
        height: 250,
    },
})

export default HomeScreen
