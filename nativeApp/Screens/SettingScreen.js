import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Button, List, Snackbar } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import CompleteProfileScreen from './CompleteProfileScreen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { auth, db, storage } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

const SettingScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [expanded, setExpanded] = React.useState(true)
  const [name, setName] = useState('')
  const [profilePicture, setProfilePicture] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(null)
  const [image, setImage] = useState(null)
  const [hotspotList, setHotspotList] = useState([])
  const [groupList, setGroupList] = useState([])

  const currentUser = auth.currentUser
  let phoneNumber = currentUser.phoneNumber
  phoneNumber = phoneNumber.slice(3)

  const handlePress = () => setExpanded(!expanded)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  const onDismissSnackBar = () => setVisible(false)

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

  useEffect(async () => {
    const userRef = doc(db, 'trackerAndroidUser', phoneNumber)
    const snapshot = await getDoc(userRef)
    if (snapshot.exists()) {
      const data = snapshot.data()
      setName(data.name)
      setProfilePicture(data.profilePicture)
    }
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    console.log(result)

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  const uploadImageToStorage = async () => {
    return new Promise((resolve) => {
      const storageRef = ref(
        storage,
        `trackerAndroidUser/${phoneNumber}/profilePicture`
      )
      const metadata = {
        contentType: 'image/*',
      }
      const uploadTask = uploadBytesResumable(storageRef, image, metadata)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused')
              break
            case 'running':
              console.log('Upload is running')
              break
          }
        },
        () => {
          setMessage('Error uploading Profile Picture Please upload again')
          setVisible(true)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const updateData = async () => {
    if (name.length === 0) {
      setMessage('Name length cannot be 0')
      setVisible(true)
      return
    }

    await uploadImageToStorage()
      .then((url) => {
        setDoc(
          doc(db, 'trackerAndroidUser', phoneNumber),
          {
            name: name,
            profilePicture: url,
          },
          { merge: true }
        )
          .then(() => {
            setMessage('profile updated successfully')
            setVisible(true)
          })
          .catch((error) => console.log(error))
      })
      .catch((err) => console.log(err))
  }

  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='Settings'
        menuVisible={menuVisible}
      />
      <View style={styles.saveBtnContainer}>
        <Button mode='contained' onPress={() => updateData()}>
          Save
        </Button>
      </View>
      <View style={styles.mainContainer}>
        <List.Section>
          <List.Accordion
            title='Profile'
            expanded={expanded}
            onPress={handlePress}
          >
            <CompleteProfileScreen
              pickImage={pickImage}
              phoneNumber={phoneNumber}
              name={name}
              setName={setName}
              image={image}
              profilePicture={profilePicture}
              visible={visible}
              setVisible={setVisible}
              message={message}
            />
          </List.Accordion>

          <List.Accordion title='Security'>
            <List.Item title='Your Permissions' />
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

      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            setVisible(false)
          },
        }}
      >
        {message}
      </Snackbar>
    </View>
  )
}

export default SettingScreen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  saveBtnContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: 10,
  },
  mainContainer: {
    padding: 10,
    position: 'relative',
  },
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
})
