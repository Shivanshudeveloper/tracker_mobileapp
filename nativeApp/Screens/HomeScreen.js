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
  BackHandler,
  Alert,
} from 'react-native'
import { Button, Title } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import Colors from '../constants/Colors'
import * as Location from 'expo-location'
import { auth, db } from '../firebase'
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  getDoc,
  setDoc,
  arrayUnion,
  addDoc,
  Timestamp,
  orderBy,
  limit,
} from 'firebase/firestore'
import RequestComponent from '../Components/RequestComponent'
import MapView, { Marker } from 'react-native-maps'
import AsyncStorage from '@react-native-async-storage/async-storage'
import moment from 'moment'

const WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [lon, setLon] = useState(77.3021)
  const [lat, setLat] = useState(28.5971)
  const [granted, setGranted] = useState(false)
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
  const [lastDate, setLasDate] = useState(0)

  LogBox.ignoreLogs(['Setting a timer', 'AsyncStorage has been extracted'])

  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const color = Colors[colorScheme]
  const { currentUser } = auth
  let { phoneNumber } = currentUser
  phoneNumber = phoneNumber.slice(3)

  let interval = null

  // getting location after an interval
  useEffect(() => {
    if (!granted) {
      return
    }

    interval = setInterval(async () => {
      Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
        .then((res) => {
          const latitude = Number(res.coords.latitude.toPrecision(6))
          const longitude = Number(res.coords.longitude.toPrecision(6))

          setLat(latitude)
          setLon(longitude)
          setCoordinateInDB(latitude, longitude)
        })
        .catch((error) => console.log(error))
    }, 60000)

    return () => clearInterval(interval)
  }, [granted])

  // getting location permission and coordinates from DB
  useEffect(() => {
    const _getLocationPermission = async () => {
      await Location.requestForegroundPermissionsAsync()
        .then(async ({ status }) => {
          if (status === 'granted') {
            await Location.requestBackgroundPermissionsAsync()
              .then(({ bgStatus }) => {
                if (bgStatus !== 'granted') {
                  Alert('Permission to Background Access location was denied')
                  BackHandler.exitApp()
                }
              })
              .catch((error) => console.log(error))

            await Location.getCurrentPositionAsync({})
            await getCoordinateFromDB()
            await getGroupsAndHotspots()

            setGranted(true)
          } else {
            Alert('Permission to Foreground Access location was denied')
            BackHandler.exitApp()
          }
        })
        .catch((error) => console.log(error))
    }
    _getLocationPermission()
  }, [])

  // listening for tracking requests
  useEffect(() => {
    const requestRef = doc(db, 'trackingRequest', phoneNumber)
    return onSnapshot(requestRef, (document) => {
      if (document.exists()) {
        const reqList = document.data().requestList
        const pendingRequests = reqList.filter(
          (item) => item.requestStatus === 'pending'
        )
        setRequestList(pendingRequests)
      }
    })
  }, [])

  useEffect(() => {
    const ref = collection(db, 'trackingLocations', phoneNumber, 'locations')

    const q = query(ref, orderBy('createdAt', 'desc'), limit(1))
    const unsub = onSnapshot(q, (snaps) => {
      const arr = []
      snaps.forEach((snap) => {
        arr.push(snap.data())
      })
      if (arr.length === 1) {
        const data = arr[0]
        setLastLong(data.longitude)
        setLastLat(data.latitude)
        setLastAddress(data.address)
        setLasDate(
          moment(new Date(data.createdAt.seconds * 1000)).format('DD-MM-YYYY')
        )
      }
    })

    return () => unsub()
  }, [])

  const checkLatAndLong = (latitude, longitude) => {
    console.log('here', lastLat, lastLong)

    if (lastLat === 0 && lastLong === 0) {
      return true
    } else if (
      latitude >= lastLat - 0.0005 &&
      latitude <= lastLat + 0.0005 &&
      longitude > lastLong - 0.0005 &&
      longitude <= lastLong + 0.0005
    ) {
      return true
    } else {
      return false
    }
  }

  // getting zipcode and checking with hotspots using reverse geocoding
  useEffect(() => {
    if (!granted) {
      return
    }

    Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lon,
    })
      .then(async (response) => {
        const currZipCode = response[0].postalCode
        const address = `${response[0].name}, ${response[0].district}, ${response[0].subregion}, ${response[0].region}-${currZipCode}, ${response[0].country}`
        const hotspotArr = hotspotList.filter(
          (item) => item.location.zipCode === currZipCode
        )

        hotspotArr.forEach(async (hotspot) => {
          const hotspotId = hotspot.id
          const trackerId = hotspot.createdBy
          const schedule = hotspot.schedule

          const startDay = WEEK.indexOf(schedule.startDay)
          const endDay = WEEK.indexOf(schedule.endDay)

          const { time } = schedule

          const rawDate = new Date()
          const date = moment(new Date(rawDate)).format('DD-MM-YYYY')
          const month = new Date(rawDate).getMonth() + 1
          const year = new Date(rawDate).getFullYear()

          var format = 'hh:mm:ss'
          const currentDay = moment(rawDate).day()
          const currentTime = moment()
          const startTime = moment(time.startTime, format)
          const endTime = moment(time.endTime, format)

          const attendanceRef = doc(
            db,
            'trackingAttendance',
            phoneNumber,
            trackerId,
            hotspotId
          )
          console.log(date, lastDate, lastDate !== date)
          if (
            currentTime.isBetween(startTime, endTime) &&
            currentDay >= startDay &&
            currentDay <= endDay &&
            lastDate !== date
          ) {
            setDoc(
              attendanceRef,
              {
                phoneNumber: phoneNumber,
                hotspotName: hotspot.hotspotName,
                hotspotId: hotspotId,
                date: date,
                year: year,
                month: month,
                createdAt: Timestamp.now(),
              },
              { merge: true }
            ).catch((error) => {
              console.log(error)
            })

            console.log(address, lastAddres, lastDate)

            if (
              (address !== lastAddres && checkLatAndLong(lat, lon)) ||
              lastDate !== date
            ) {
              setLastAddress(address)
              setLastLat(lat)
              setLastLong(lon)
              setLasDate(date)
              const ref = collection(
                db,
                'trackingLocations',
                phoneNumber,
                'locations'
              )
              addDoc(ref, {
                address,
                group: hotspot.groupName,
                hotspot: hotspot.hotspotName,
                trackerId,
                month,
                year,
                zipCode: currZipCode,
                latitude: lat,
                longitude: lon,
                createdAt: Timestamp.now(),
              })
                .then(() => console.log('location added'))
                .catch((err) => console.log(err))
            }
          } else {
            console.log('Not Marked')
          }
        })
      })
      .catch((error) => console.log(error))
  }, [lat, lon])

  const getHotspot = async (group) => {
    return new Promise(async (resolve) => {
      const docRef = doc(db, 'trackingGroups', group.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const groupData = docSnap.data()
        const hotspot = groupData.hotspot
        hotspot.map((x) => {
          x['groupName'] = groupData.groupName
          x['createdBy'] = groupData.createdBy
          x['schedule'] = groupData.schedule
        })

        resolve(hotspot)
      } else {
        console.log('No such document exist')
      }
    })
  }

  const getGroupsAndHotspots = async () => {
    const userRef = collection(db, 'trackingUsers')
    const q = query(userRef, where('phoneNumber', '==', phoneNumber))

    const unsub = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach(async (document) => {
        const data = document.data()
        const groups = data.deviceGroups
        AsyncStorage.setItem('groups', JSON.stringify(groups))

        const hotspots = []

        for (let group of groups) {
          const data = await getHotspot(group)
          hotspots.push(...data)
        }

        setHotspotList(hotspots)
      })
    })

    return () => unsub()
  }

  //function to get coordinate from db
  const getCoordinateFromDB = async () => {
    const userRef = doc(db, 'trackerAndroidUser', phoneNumber)
    onSnapshot(userRef, (document) => {
      if (document.exists()) {
        const data = document.data()
        const coord = data.liveLocation
        setLat(Number(coord.latitude))
        setLon(Number(coord.longitude))
      }
    })
  }

  // setting coordinate in DB
  const setCoordinateInDB = async (latitude, longitude) => {
    console.log('coord ::', latitude, longitude)
    const userRef = doc(db, 'trackerAndroidUser', phoneNumber)

    setDoc(
      userRef,
      {
        liveLocation: {
          latitude: latitude,
          longitude: longitude,
        },
      },
      { merge: true }
    )
      .then(() => console.log('data set'))
      .catch((error) => console.log(error))
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
        <Marker coordinate={{ latitude: lat, longitude: lon }} />
      </MapView>

      <SafeAreaView
        style={[styles.mainContainer, { backgroundColor: color.background }]}
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
              <RequestComponent item={item} phoneNumber={phoneNumber} />
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
