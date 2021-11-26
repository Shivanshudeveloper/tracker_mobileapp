import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Image, View, StyleSheet } from 'react-native'
import { Button, List, Title } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'

const HomeScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)

  const navigation = useNavigation()

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='User Name'
        menuVisible={menuVisible}
      />
      <View style={styles.mainContainer}>
        <Title>Current Activity</Title>
        <View style={styles.mapContainer}>
          <Image
            style={styles.map}
            source={require('../assets/images/map.png')}
          />
        </View>
        <Button
          labelStyle={styles.btnLabelStyle}
          style={styles.button}
          mode='contained'
          onPress={() => navigation.navigate('TrackerList')}
        >
          See who's tracking you
        </Button>

        <View style={styles.divider}></View>

        <Title>New Tracking Requests</Title>
        <View style={styles.listContainer}>
          <List.Item
            title='<Name> has requested to track you'
            description={() => (
              <View style={styles.listActionButtonContainer}>
                <Button style={{ margin: 3 }} mode='contained' icon='check'>
                  Accept
                </Button>
                <Button style={{ margin: 3 }} mode='contained' icon='close'>
                  Reject
                </Button>
              </View>
            )}
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
  mapContainer: {
    width: '100%',
    marginVertical: 15,
  },
  map: {
    width: '100%',
    height: 250,
  },
  btnLabelStyle: {
    paddingVertical: 7,
  },
  divider: {
    height: 1,
    backgroundColor: 'grey',
    marginVertical: 10,
  },
  listContainer: {},
  listActionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
  },
})

export default HomeScreen
