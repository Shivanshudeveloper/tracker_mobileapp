import React, { useState } from 'react'
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native'
import { Subheading, Title, List, Divider } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import AppBar from '../Components/AppBarComponent'

const NotificationScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [filter, setFilter] = useState('cpp')

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)
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
        <View style={styles.filterContainer}>
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
        </View>
        <View style={styles.notificationContainer}>
          <List.Item
            title='<Notification>'
            description='Date / Time'
            left={(props) => <List.Icon {...props} icon='email' />}
          />
          <Divider />
          <List.Item
            title='<Notification>'
            description='Date / Time'
            left={(props) => <List.Icon {...props} icon='email' />}
          />
          <Divider />
          <List.Item
            title='<Notification>'
            description='Date / Time'
            left={(props) => <List.Icon {...props} icon='email' />}
          />
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
