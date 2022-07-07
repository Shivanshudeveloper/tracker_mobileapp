import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Avatar, Button, List } from 'react-native-paper'
import { db } from '../../firebase'
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  setDoc,
  collection,
  query,
  where,
  getDoc,
  getDocs,
  addDoc,
} from 'firebase/firestore'
import axios from 'axios'
import { API_SERVICE } from '../../URI'

const RequestComponent = (props) => {
  const { item, phoneNumber } = props
  const { companyName } = item

  const updateUser = async (status) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const body = {
      trackingStatus: status,
      phoneNumber: phoneNumber,
      createdBy: item.sender.id,
    }

    await axios
      .put(`${API_SERVICE}/update/device`, body, config)
      .catch((error) => console.log(error))
  }

  const sendNotification = async (status) => {
    const ref = collection(
      db,
      'trackingWebNotification',
      item.sender.id,
      'notifications',
    )

    await addDoc(ref, {
      message: `${item.recieverFullName} - ${phoneNumber} has ${status} your tracking Request`,
      name: item.recieverFullName,
      phoneNumber: phoneNumber,
      requestStatus: status,
      createdAt: Timestamp.now(),
      seen: false,
    }).catch((err) => console.log(err))
  }

  const onAcceptRequest = () => {
    const requestRef = doc(
      db,
      'trackingRequest',
      phoneNumber,
      'requests',
      item.id,
    )

    updateDoc(requestRef, {
      requestStatus: 'accepted',
    })
      .then(async () => {
        await updateUser('accepted')
        await sendNotification('accepted')
      })
      .catch((error) => console.log(error))
  }

  const onRejectRequest = () => {
    const requestRef = doc(
      db,
      'trackingRequest',
      phoneNumber,
      'requests',
      item.id,
    )

    updateDoc(requestRef, {
      requestStatus: 'rejected',
    })
      .then(async () => {
        await updateUser('rejected')
        await sendNotification('rejected')
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      <List.Item
        title={`${companyName} has requested to track you`}
        description={() => (
          <View style={styles.listActionButtonContainer}>
            <Button
              style={{ margin: 3 }}
              mode="contained"
              icon="check"
              onPress={onAcceptRequest}
            >
              Accept
            </Button>
            <Button
              style={{ margin: 3 }}
              mode="contained"
              icon="close"
              onPress={onRejectRequest}
            >
              Reject
            </Button>
          </View>
        )}
        left={(props) => (
          <Avatar.Image
            {...props}
            size={50}
            source={{ uri: item.sender.profilePhoto }}
          />
        )}
      />
    </>
  )
}

const styles = StyleSheet.create({
  listActionButtonContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    zIndex: 2,
  },
})

export default React.memo(RequestComponent)
