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
import { auth, db } from '../firebase'
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  query,
  where,
  getDoc,
  getDocs,
  setDoc,
  arrayUnion,
  FieldPath,
  documentId,
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
  const [lon, setLon] = useState(28.3672487)
  const [lat, setLat] = useState(77.5413416)
  const [granted, setGranted] = useState(false)
  const [requestList, setRequestList] = useState([])
  const [groupList, setGroupList] = useState([])
  const [trackerList, setTrackerList] = useState([])
  const [hotspotList, setHotspotList] = useState([])
  const [region, setRegion] = useState({
    latitude: lat,
    latitudeDelta: lon,
    longitude: 77.30297047808766,
    longitudeDelta: 0.013364441692829132,
  })

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
          setLat(res.coords.latitude)
          setLon(res.coords.longitude)
          setCoordinateInDB(res.coords.latitude, res.coords.longitude)
        })
        .catch((error) => console.log(error))
    }, 60000)

    return () => clearInterval(interval)
  }, [granted])

  // getting location permission and coordinates from DB
  useEffect(() => {
    const _getLocationPermission = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      } else {
        await Location.getCurrentPositionAsync({})
        await getCoordinateFromDB()
        await getGroupsAndHotspots()

        setGranted(true)
      }
    }
    _getLocationPermission()
  }, [])

  // getting tracker and schedules
  useEffect(() => {
    const trackerRef = doc(db, 'trackers', phoneNumber)
    onSnapshot(trackerRef, (snapshot) => {
      if (snapshot.exists()) {
        const list = snapshot.data().trackerList

        const scheduleRef = collection(db, 'trackingSchedule')
        const q = query(scheduleRef, where(documentId(), 'in', list))

        onSnapshot(q, (documents) => {
          const arr = []
          documents.forEach((document) => {
            if (document.exists()) {
              arr.push({ id: document.id, schedule: document.data() })
            }
          })

          setTrackerList(arr)
        })
      } else {
        console.log('Here')
      }
    })
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

  // getting zipcode and checking with hotspots
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
        const arr = hotspotList.filter((item) => item.zipCode === currZipCode)

        console.log('Array ::', arr)

        trackerList.forEach((tracker) => {
          arr.forEach(async (hotspot) => {
            if (hotspot.createdBy === tracker.id) {
              const id = hotspot.id
              const attendanceRef = doc(db, 'trackingAttendance', phoneNumber)
              const schedule = tracker.schedule

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

              console.log(currentDay, startDay, endDay)

              if (
                currentTime.isBetween(startTime, endTime) &&
                currentDay >= startDay &&
                currentDay <= endDay
              ) {
                setDoc(
                  attendanceRef,
                  {
                    phoneNumber: phoneNumber,
                    [tracker.id]: {
                      [id]: {
                        [year]: {
                          [month]: arrayUnion(date),
                        },
                        totalCount: arrayUnion(date),
                      },
                    },
                  },
                  { merge: true }
                )
                  .then(() => {
                    console.log('Attendance Marked')
                  })
                  .catch((error) => {
                    console.log(error)
                  })
              } else {
                console.log('Not')
              }
            }
          })
        })
      })
      .catch((error) => console.log(error))
  }, [lat, lon])

  const getGroupsAndHotspots = async () => {
    const userRef = collection(db, 'trackingUsers')
    const q = query(userRef, where('phoneNumber', '==', phoneNumber))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((document) => {
      const data = document.data()
      const groups = data.deviceGroups

      setGroupList(groups)
      AsyncStorage.setItem('groups', JSON.stringify(groups))

      const hotspots = []
      groups.forEach(async (item) => {
        const docRef = doc(db, 'trackingGroups', item.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const groupData = docSnap.data()
          const hotspot = groupData.hotspot
          hotspot.map((x) => {
            x['createdBy'] = groupData.createdBy
          })
          hotspots.push(...hotspot)
        } else {
          console.log('No such document exist')
        }
      })

      setHotspotList(hotspots)
    })
  }

  //function to get coordinate from db
  const getCoordinateFromDB = async () => {
    const userRef = doc(db, 'trackerAndroidUser', phoneNumber)
    onSnapshot(userRef, (document) => {
      if (document.exists()) {
        const data = document.data()
        const coord = data.liveLocation
        setLat(coord.latitude)
        setLon(coord.longitude)
      }
    })
  }

  // setting coordinate in DB
  const setCoordinateInDB = async (latitude, longitude) => {
    console.log(latitude, longitude)
    const userRef = doc(db, 'trackerAndroidUser', phoneNumber)

    setDoc(
      userRef,
      {
        liveLocation: {
          latitude,
          longitude,
        },
      },
      { merge: true }
    )
      .then(() => console.log('data set'))
      .catch((error) => console.log(error))
  }

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  const onRegionChange = (region) => {
    setRegion({ region })
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='User Name'
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
