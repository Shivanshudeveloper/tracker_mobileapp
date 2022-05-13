import React, { useState, useEffect } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Subheading, Title, List, Divider } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import AppBar from '../Components/AppBarComponent'

import { db, auth } from '../firebase'
import { doc, onSnapshot } from 'firebase/firestore'
import moment from 'moment'

const NotificationScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [filter, setFilter] = useState('cpp')
  const [notificationList, setNotficationList] = useState([])

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  const currentUser = auth.currentUser
  let { phoneNumber } = currentUser
  phoneNumber = phoneNumber.slice(3)

  const getTime = (sec) => {
    const str = moment(new Date(sec * 1000)).fromNow()

    switch (str) {
      case 'in a few seconds':
        return 'few sec'
      case 'a few seconds ago':
        return 'few sec'
      case 'a minute ago':
        return '1m'
      case 'an hour ago':
        return '1h'
      case 'a day ago':
        return '1day'
      default:
        const first = str.split(' ')[0]
        let mid = str.split(' ')[1]
        if (mid === 'minutes' || mid === 'minute') {
          mid = 'm'
        }
        if (mid === 'hours' || mid === 'hour') {
          mid = 'h'
        }
        if (mid === 'days' || mid === 'day') {
          mid = 'd'
        }
        return first + mid
    }
  }

  useEffect(() => {
    const ref = doc(db, 'trackingAndroidNotification', phoneNumber)

    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const list = snapshot.data().notificationList

        const arr = list.sort((a, b) => {
          return b.createdAt.seconds - a.createdAt.seconds
        })

        setNotficationList(arr)
      }
    })

    return () => unsub()
  }, [])

  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='Notifications'
        menuVisible={menuVisible}
      />
      <View style={styles.mainContainer}>
        <TouchableWithoutFeedback onPress={() => console.log('pressed')}>
          <Subheading style={styles.markAllText}>Mark all as Read</Subheading>
        </TouchableWithoutFeedback>
        {/* <View style={styles.filterContainer}>
          <Title style={styles.filterTitleText}>Filter by:</Title>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.filterPicker}
              selectedValue={filter}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) => setFilter(itemValue)}
            >
              <Picker.Item label='C++' value='cpp' />
              <Picker.Item label='Java' value='java' />
              <Picker.Item label='JavaScript' value='js' />
              <Picker.Item label='Python' value='py' />
            </Picker>
          </View>
        </View> */}
        <View style={styles.notificationContainer}>
          {notificationList.map((item, i) => (
            <View key={i}>
              <List.Item
                title={item.message}
                description={`${getTime(item.createdAt.seconds)} ago`}
                left={(props) => <List.Icon {...props} icon='email' />}
              />
              <Divider />
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    padding: 10,
    position: 'relative',
  },
  markAllText: {
    textAlign: 'right',
  },
  filterContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  filterTitleText: {
    textAlignVertical: 'center',
  },
  pickerContainer: {
    flex: 1,
    height: 50,
    marginLeft: 20,
    backgroundColor: '#d1d1d1',
  },
  notificationContainer: {
    marginTop: 10,
  },
})

export default NotificationScreen
