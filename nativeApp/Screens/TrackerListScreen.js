import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, List, Title, Dialog, Paragraph } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'
import { auth, db } from '../firebase'
import {
  arrayRemove,
  arrayUnion,
  doc,
  onSnapshot,
  updateDoc,
  Timestamp,
  setDoc,
} from 'firebase/firestore'

const AlertDialog = (props) => {
  const { visible, hideDialog, turnOffTracking, item } = props
  return (
    <Dialog visible={visible} onDismiss={hideDialog}>
      <Dialog.Title>Alert</Dialog.Title>
      <Dialog.Content>
        <Paragraph>
          Your Tracker will be notified that you turned off tracking
        </Paragraph>
        <Paragraph>Do you want to continue?</Paragraph>
      </Dialog.Content>
      <Dialog.Actions>
        <Button style={{ marginRight: 8 }} onPress={hideDialog}>
          Cancel
        </Button>
        <Button onPress={() => turnOffTracking(item)}>Turn off Tracking</Button>
      </Dialog.Actions>
    </Dialog>
  )
}

const TrackerListScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [visible, setVisible] = React.useState(false)
  const [trackingList, setTrackingList] = useState([])
  const [selectedItem, setSelectedItem] = useState({})

  const { currentUser } = auth
  let { phoneNumber } = currentUser
  phoneNumber = phoneNumber.slice(3)

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  useEffect(() => {
    const requestRef = doc(db, 'trackingRequest', phoneNumber)
    const unsub = onSnapshot(requestRef, (snapshot) => {
      if (snapshot.exists()) {
        const requestList = snapshot.data().requestList
        if (requestList !== undefined) {
          const acceptedRequest = requestList.filter(
            (item) => item.requestStatus === 'accepted'
          )

          setTrackingList(acceptedRequest)
        }
      }
    })

    return () => unsub()
  }, [])

  const turnOffTracking = async (item) => {
    console.log(item)
    const requestRef = doc(db, 'trackingRequest', phoneNumber)
    updateDoc(requestRef, {
      requestList: arrayRemove(item),
    }).catch((err) => console.log(error))

    updateDoc(requestRef, {
      requestList: arrayUnion({
        ...item,
        requestStatus: 'rejected',
      }),
    }).catch((error) => console.log(error))

    updateDoc(doc(db, 'trackingWebNotification', item.senderId), {
      notificationList: arrayUnion({
        createdAt: Timestamp.now(),
        message: `${phoneNumber} has turned off tracking`,
        name: '',
        phoneNumber: phoneNumber,
        requestStatus: 'rejected',
      }),
    }).catch((error) => console.log(error))

    // removing sender id from tracKerList
    const ref = doc(db, 'trackers', phoneNumber)
    setDoc(
      ref,
      {
        trackerList: arrayRemove(item.senderId),
      },
      {
        merge: true,
      }
    ).catch((err) => console.log(err))

    hideDialog()
  }

  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title=''
        menuVisible={menuVisible}
      />
      <View style={styles.mainContainer}>
        <Title>You are currently being tracked by:</Title>
        <View style={styles.trackerListContainer}>
          {trackingList.map((item, index) => (
            <View key={index}>
              <List.Item
                title={item.companyName}
                description='Tracking Schedule'
                left={(props) => <List.Icon {...props} icon='email' />}
                right={() => (
                  <View style={styles.actionBtnContainer}>
                    <Button
                      mode='contained'
                      onPress={() => {
                        setSelectedItem(item)
                        showDialog()
                      }}
                    >
                      Turn off Tracking
                    </Button>
                  </View>
                )}
              />
            </View>
          ))}
        </View>
        <AlertDialog
          visible={visible}
          item={selectedItem}
          hideDialog={hideDialog}
          turnOffTracking={turnOffTracking}
        />
      </View>
    </View>
  )
}

export default TrackerListScreen

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  mainContainer: {
    padding: 10,
    position: 'relative',
    flex: 1,
  },
  trackerListContainer: {
    marginTop: 10,
  },
  actionBtnContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
})
