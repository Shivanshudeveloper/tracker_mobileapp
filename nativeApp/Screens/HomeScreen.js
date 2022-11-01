import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
    View,
    StyleSheet,
    FlatList,
    SafeAreaView,
    LogBox,
    PermissionsAndroid,
    Text,
} from 'react-native'
import { Button } from 'react-native-paper'
import * as Location from 'expo-location'
import { auth, db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import axios from 'axios'
import { API_SERVICE } from '../URI'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ReactNativeForegroundService from '@supersami/rn-foreground-service'
import RNLocation from 'react-native-location'
import { useNetInfo } from '@react-native-community/netinfo'

import AppBar from '../Components/AppBarComponent'
import RequestComponent from '../Components/RequestComponent'
import MapComponent from '../Components/MapComponent/MapComponent'

const WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
]

RNLocation.configure({
    distanceFilter: 100, // Meters
    desiredAccuracy: {
        ios: 'best',
        android: 'balancedPowerAccuracy',
    },
    // Android only
    androidProvider: 'auto',
    interval: 30000, // Milliseconds
    fastestInterval: 30000, // Milliseconds
    maxWaitTime: 30000, // Milliseconds
    // iOS Only
    activityType: 'other',
    allowsBackgroundLocationUpdates: false,
    headingFilter: 1, // Degrees
    headingOrientation: 'portrait',
    pausesLocationUpdatesAutomatically: false,
    showsBackgroundLocationIndicator: false,
})

const config = {
    headers: {
        'Content-Type': 'application/json',
    },
}

const HomeScreen = () => {
    const [menuVisible, setMenuVisible] = useState(false)
    const [lon, setLon] = useState(0)
    const [lat, setLat] = useState(0)
    const [requestList, setRequestList] = useState([])
    const [internetAvailable, setInternetAvailable] = useState(false)

    const netInfo = useNetInfo()

    LogBox.ignoreLogs([
        'Setting a timer',
        'Warning: Failed prop type: The prop',
    ])

    const navigation = useNavigation()
    const { currentUser } = auth
    let { phoneNumber } = currentUser

    let locationSubscription = null
    let locationTimeout = null

    useEffect(() => {
        if (netInfo.isConnected) {
            setInternetAvailable(true)
        }
    }, [netInfo])

    useEffect(() => {
        if (internetAvailable) {
            const updateDB = async () => {
                let pendingTask = await AsyncStorage.getItem('pendingTask')

                let i = 0

                if (pendingTask) {
                    pendingTask = JSON.parse(pendingTask)
                    for (let task of pendingTask) {
                        const body = task

                        await axios
                            .post(
                                `${API_SERVICE}/locationAndattendance`,
                                body,
                                config
                            )
                            .then((res) => {
                                console.log('offline', res.data)
                                i += 1
                            })
                            .catch((err) => {
                                console.log(err.response.data.message)
                                console.log(err.message)
                            })
                    }

                    if (i === pendingTask.length) {
                        await AsyncStorage.removeItem('pendingTask').then(() =>
                            console.log('offline data removed')
                        )
                    }
                }
            }

            updateDB()
        }
    }, [internetAvailable])

    ReactNativeForegroundService.add_task(
        async () => {
            await RNLocation.requestPermission({
                ios: 'whenInUse',
                android: {
                    detail: 'fine',
                },
            }).then(async (granted) => {
                console.log('Location Permissions: ', granted)
                // if has permissions try to obtain location with RN location
                if (granted) {
                    locationSubscription && locationSubscription()
                    locationSubscription =
                        RNLocation.subscribeToLocationUpdates(
                            async ([locations]) => {
                                locationSubscription()
                                locationTimeout && clearTimeout(locationTimeout)
                                const { latitude, longitude } = locations

                                setLat(latitude)
                                setLon(longitude)

                                const body = {
                                    latitude,
                                    longitude,
                                    phoneNumber,
                                }

                                console.log(latitude, longitude)

                                if (internetAvailable) {
                                    await axios
                                        .post(
                                            `${API_SERVICE}/locationAndattendance`,
                                            body,
                                            config
                                        )
                                        .then((res) => {
                                            console.log(res.data)
                                        })
                                        .catch((err) => {
                                            console.log(
                                                err.response.data.message
                                            )
                                            console.log(err.message)
                                        })
                                } else {
                                    let pendingTask =
                                        await AsyncStorage.getItem(
                                            'pendingTask'
                                        )

                                    if (pendingTask) {
                                        pendingTask = JSON.parse(pendingTask)
                                        await AsyncStorage.setItem(
                                            'pendingTask',
                                            JSON.stringify([
                                                body,
                                                ...pendingTask,
                                            ])
                                        ).then(() =>
                                            console.log('offline data set')
                                        )
                                    } else {
                                        pendingTask = JSON.parse(pendingTask)

                                        await AsyncStorage.setItem(
                                            'pendingTask',
                                            JSON.stringify([body])
                                        ).then(() =>
                                            console.log('offline data set')
                                        )
                                    }
                                }
                            }
                        )
                } else {
                    locationSubscription && locationSubscription()
                    locationTimeout && clearTimeout(locationTimeout)
                    console.log('no permissions to obtain location')
                }
            })
        },
        {
            delay: 30000,
            onLoop: true,
            taskId: 'gpstracker',
            onError: (e) => console.log('Error logging:', e),
        }
    )

    useEffect(async () => {
        ReactNativeForegroundService.start({
            id: 'gpstracker',
            title: 'Tracking Started',
            message: 'GPS Tracker is tracking your live location',
        })
    }, [])

    useEffect(async () => {
        const backgroundgranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
                title: 'Background Location Permission',
                message:
                    'We need access to your location ' +
                    'so you can get live quality updates.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        )
        if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Background Granted')
            if (internetAvailable) {
                await checkIfUserExist()
            }
        }
    }, [])

    const checkIfUserExist = async () => {
        const { data } = await axios.get(
            `${API_SERVICE}/get/livelocation/${phoneNumber}`
        )

        if (data) {
            console.log('User Exist')
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

    //listening for tracking requests
    useEffect(() => {
        if (!internetAvailable) {
            return
        }
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

    useEffect(() => {
        if (!internetAvailable) {
            return
        }

        const getGroupAndHotspot = async () => {
            await axios
                .get(`${API_SERVICE}/get/device/${phoneNumber}`)
                .then((res) => {
                    const { data } = res
                    const hotspots = []
                    const groups = []
                    data.forEach((device) => {
                        device.groups.forEach((group) => {
                            groups.push(group)
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

                    storeGroupAndHotspot(hotspots, groups)

                    return hotspots
                })
                .catch((error) => console.log(error.message))
        }

        getGroupAndHotspot()
    }, [])

    const storeGroupAndHotspot = async (hotspots, groups) => {
        try {
            await AsyncStorage.setItem('hotspots', JSON.stringify(hotspots))
            await AsyncStorage.setItem('groups', JSON.stringify(groups))
        } catch (e) {
            console.log(e.message)
        }
    }

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    return (
        <SafeAreaView style={styles.container}>
            <AppBar
                onPress={openMenu}
                closeMenu={closeMenu}
                menuVisible={menuVisible}
            />
            <View
                style={{
                    padding: 10,
                    zIndex: 1000,
                    backgroundColor: 'white',
                }}
            >
                <Text style={{ fontSize: 20 }}>Current Activity</Text>
            </View>

            <MapComponent latitude={lat} longitude={lon} />

            <SafeAreaView style={[styles.mainContainer]}>
                <Button
                    labelStyle={styles.btnLabelStyle}
                    style={styles.button}
                    mode='contained'
                    onPress={() => navigation.navigate('TrackerList')}
                >
                    See who's tracking you
                </Button>

                <View style={styles.divider}></View>
                {requestList.length !== 0 ? (
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
                ) : (
                    <View style={styles.noRequestContainer}>
                        <Text
                            style={{
                                color: 'black',
                                fontSize: 20,
                                fontWeight: 'bold',
                            }}
                        >
                            No Tracking Request
                        </Text>
                    </View>
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
        backgroundColor: 'white',
    },
    btnLabelStyle: {
        paddingVertical: 7,
        fontWeight: 'bold',
        color: 'white',
    },
    divider: {
        height: 1,
        backgroundColor: 'grey',
        marginVertical: 10,
    },
    noRequestContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#007bff',
    },
})

export default HomeScreen
