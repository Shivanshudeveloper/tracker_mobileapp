import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { List } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

const SettingScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [expanded, setExpanded] = React.useState(true)
  const [hotspotList, setHotspotList] = useState([])
  const [groupList, setGroupList] = useState([])

  const currentUser = auth.currentUser
  let phoneNumber = currentUser.phoneNumber
  phoneNumber = phoneNumber.slice(3)

  const handlePress = () => setExpanded(!expanded)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  useEffect(async () => {
    let groups = []
    await AsyncStorage.getItem('groups')
      .then(async (res) => {
        if (res !== null || res !== undefined) {
          setGroupList(JSON.parse(res))
          groups = JSON.parse(res)
        }
      })
      .catch((error) => console.log(error))

    const hotspots = await getHotspots(groups)

    setHotspotList(hotspots)
  }, [])

  const getHotspots = async (groups) => {
    return new Promise(async (resolve) => {
      const hotspots = []
      for (let group of groups) {
        const docRef = doc(db, 'trackingGroups', group.id)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          const groupData = docSnap.data()
          const hotspot = groupData.hotspot
          hotspots.push(...hotspot)
        }
      }

      resolve(hotspots)
    })
  }

  //console.log(hotspotList)

  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='Settings'
        menuVisible={menuVisible}
      />
      <View style={styles.mainContainer}>
        <List.Section>
          <List.Accordion
            title='Profile'
            expanded={expanded}
            onPress={handlePress}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number :</Text>
              <Text style={{ fontSize: 16 }}>+91 {phoneNumber}</Text>
            </View>
          </List.Accordion>

          <List.Accordion title='Groups and Hotspots'>
            <View style={styles.rowContainer}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>Your Groups</Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {groupList.map((item, i) => (
                  <View
                    key={i}
                    style={{ display: 'flex', flexDirection: 'row' }}
                  >
                    <Text>
                      {item.groupName}
                      {i !== groupList.length - 1 && <Text>, </Text>}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.rowContainer}>
              <Text style={{ fontSize: 16, marginRight: 10 }}>
                Your Hotspots
              </Text>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}
              >
                {hotspotList.map((item, i) => (
                  <View key={i}>
                    <Text>
                      {item.hotspotName}
                      {i !== groupList.length - 1 && <Text>, </Text>}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </List.Accordion>
        </List.Section>
      </View>
    </View>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    padding: 10,
    position: 'relative',
    paddingTop: 20,
  },
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 30,
    paddingVertical: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})
