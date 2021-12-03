import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import {
  View,
  StyleSheet,
  useColorScheme,
  FlatList,
  SafeAreaView,
} from 'react-native'
import { Button, List, Title } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import Colors from '../constants/Colors'
import * as Location from 'expo-location'
import BackgroundTimer from 'react-native-background-timer'
import database from '@react-native-firebase/database'
import AsyncStorage from '@react-native-async-storage/async-storage'

import MapComponent from '../Components/MapComponents/MapComponent'
import RequestComponent from '../Components/RequestComponent'

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)
  const [dbCoord, setDBCoord] = useState({ lat: 0, long: 0 })
  const [number, setPhoneNumber] = useState(null)
  const [requestList, setRequestList] = useState([])

  const navigation = useNavigation()
  const colorScheme = useColorScheme()
  const color = Colors[colorScheme]

  //asking for background location permission
  useEffect(async () => {
    // let { status } = await Location.requestBackgroundPermissionsAsync()
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
    }

    if (errorMsg) {
      console.log(errorMsg)
    }

    getCoordinateFromDB()
    manageBackgroundActivity()
  }, [])

  useEffect(async () => {
    await AsyncStorage.getItem('userInfo')
      .then((res) => {
        const { phoneNumber } = JSON.parse(res)
        setPhoneNumber(phoneNumber)

        const requestRef = database().ref(
          `trackerapp/trackingRequested/${phoneNumber}`
        )
        requestRef.on('child_added', (data) => {
          requestRef.once('value', (snapshot) => {
            const arr = []
            snapshot.forEach((childSnapshot) => {
              var requestId = childSnapshot.key
              var values = childSnapshot.val()
              if (values.requestPending === true) {
                arr.push({ requestId, values })
              }
            })
            setRequestList(arr)
          })
        })

        requestRef.on('child_changed', (data) => {
          requestRef.once('value', (snapshot) => {
            const arr = []
            snapshot.forEach((childSnapshot) => {
              var requestId = childSnapshot.key
              var values = childSnapshot.val()
              // arr.push({ requestId, values })
              if (values.requestPending === true) {
                arr.push({ requestId, values })
              }
            })
            setRequestList(arr)
          })
        })
      })
      .catch((error) => console.log(error))
  }, [])

  // function to get coordinate from db
  const getCoordinateFromDB = () => {
    // console.log('getting data')
    database()
      .ref('/trackerapp/testuser')
      .on('value', (snapshot) => {
        if (snapshot !== null && snapshot.exists()) {
          console.log('value : ', snapshot.val())
          setDBCoord(snapshot.val())
        }
      })
  }

  // function to manage background activity
  const manageBackgroundActivity = () => {
    console.log('in manageACtivity')
    BackgroundTimer.setInterval(async () => {
      await Location.getCurrentPositionAsync({})
        .then((res) => setCoordinateInDB(res))
        .catch((error) => console.log(error))
    }, 60000)
  }

  // setting coordinate in DB after every minute
  const setCoordinateInDB = (coordinates) => {
    database()
      .ref('/trackerapp/testuser')
      .set({
        lat: coordinates.coords.latitude,
        long: coordinates.coords.longitude,
      })
      .then(() => console.log('data set'))
      .catch((error) => console.log(error))
  }

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  let i = 0

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

      <MapComponent latitude={dbCoord.lat} longitude={dbCoord.long} />

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
              <RequestComponent item={item} phoneNumber={number} />
            )}
            keyExtractor={() => i++}
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
})

export default HomeScreen
