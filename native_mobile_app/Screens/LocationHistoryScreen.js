import React, { useState } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { Subheading, RadioButton, Title } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import AppBar from '../Components/AppBarComponent'

const LocationHistoryScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [date, setDate] = useState('')
  const [week, setWeek] = useState('')
  const [month, setMonth] = useState('')
  const [checked, setChecked] = useState('date')

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)
  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='Location History'
        menuVisible={menuVisible}
      />
      <View style={styles.filterContainer}>
        <View style={styles.pickerItem}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <RadioButton
              value={checked}
              status={checked === 'date' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('date')}
            />
            <Subheading style={{ textAlignVertical: 'center' }}>
              Date
            </Subheading>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.filterPicker}
              selectedValue={date}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) => setDate(itemValue)}
            >
              <Picker.Item label='C++' value='cpp' />
              <Picker.Item label='Java' value='java' />
              <Picker.Item label='JavaScript' value='js' />
              <Picker.Item label='Python' value='py' />
            </Picker>
          </View>
        </View>
        <View style={styles.pickerItem}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <RadioButton
              value={checked}
              status={checked === 'week' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('week')}
            />
            <Subheading style={{ textAlignVertical: 'center' }}>
              Week
            </Subheading>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.filterPicker}
              selectedValue={week}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) => setWeek(itemValue)}
            >
              <Picker.Item label='C++' value='cpp' />
              <Picker.Item label='Java' value='java' />
              <Picker.Item label='JavaScript' value='js' />
              <Picker.Item label='Python' value='py' />
            </Picker>
          </View>
        </View>
        <View style={styles.pickerItem}>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <RadioButton
              value={checked}
              status={checked === 'month' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('month')}
            />
            <Subheading style={{ textAlignVertical: 'center' }}>
              Months
            </Subheading>
          </View>
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.filterPicker}
              selectedValue={month}
              mode='dropdown'
              onValueChange={(itemValue, itemIndex) => setMonth(itemValue)}
            >
              <Picker.Item label='C++' value='cpp' />
              <Picker.Item label='Java' value='java' />
              <Picker.Item label='JavaScript' value='js' />
              <Picker.Item label='Python' value='py' />
            </Picker>
          </View>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <View style={styles.mapContainer}>
          <Image
            style={styles.map}
            source={require('../assets/images/map.png')}
          />
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Title>Trip Number</Title>
          <Subheading>total duration</Subheading>
        </View>
        <View></View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  filterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: '#d3d3d3',
    marginTop: 10,
  },
  pickerItem: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  pickerContainer: {
    width: 120,
    backgroundColor: '#f2f3f4',
  },
  filterPicker: {
    height: 50,
  },
  mainContainer: {
    padding: 10,
    position: 'relative',
  },
  mapContainer: {
    width: '100%',
    marginBottom: 10,
  },
  map: {
    width: '100%',
    height: 250,
  },
})

export default LocationHistoryScreen
