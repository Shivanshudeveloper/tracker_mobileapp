import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, List } from 'react-native-paper'
import { db } from '../../firebase'
import {
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  setDoc,
} from 'firebase/firestore'

const RequestComponent = (props) => {
  const { item, phoneNumber } = props
  const { companyName } = item

  const onAcceptRequest = () => {
    const requestRef = doc(db, 'trackingRequest', phoneNumber)

    updateDoc(requestRef, {
      requestList: arrayRemove({
        requestStatus: 'pending',
        companyName: item.companyName,
        senderId: item.senderId,
      }),
    })
      .then(() => {
        updateDoc(requestRef, {
          requestList: arrayUnion({
            requestStatus: 'accepted',
            companyName: item.companyName,
            senderId: item.senderId,
          }),
        })
      })
      .then(() => {
        const ref = doc(db, 'trackingWebNotification', item.senderId)

        setDoc(
          ref,
          {
            notificationList: arrayUnion({
              message: `${phoneNumber} has accepted your tracking Request`,
              name: '',
              phoneNumber: phoneNumber,
              requestStatus: 'accepted',
              createdAt: Timestamp.now(),
            }),
          },
          { merge: true },
        ).catch((err) => console.log(err))
      })
      .then(() => {
        const ref = doc(db, 'trackers', phoneNumber)
        setDoc(
          ref,
          {
            trackerList: arrayUnion(item.senderId),
          },
          {
            merge: true,
          },
        ).catch((err) => console.log(err))
      })
      .catch((error) => console.log(error))
  }

  const onRejectRequest = () => {
    const requestRef = doc(db, 'trackingRequest', phoneNumber)

    updateDoc(requestRef, {
      requestList: arrayRemove({
        requestStatus: 'pending',
        companyName: item.companyName,
        senderId: item.senderId,
      }),
    })
      .then(() => {
        updateDoc(requestRef, {
          requestList: arrayUnion({
            requestStatus: 'rejected',
            companyName: item.companyName,
            senderId: item.senderId,
          }),
        })
      })
      .then(() => {
        const ref = doc(db, 'trackingWebNotification', item.senderId)

        setDoc(
          ref,
          {
            notificationList: arrayUnion({
              message: `${phoneNumber} has rejected your tracking Request`,
              name: '',
              phoneNumber: phoneNumber,
              requestStatus: 'rejected',
              createdAt: Timestamp.now(),
            }),
          },
          { merge: true },
        ).catch((err) => console.log(err))
      })
      .then(() => {
        const ref = doc(db, 'trackers', phoneNumber)
        setDoc(
          ref,
          {
            trackerList: arrayRemove(item.senderId),
          },
          {
            merge: true,
          },
        ).catch((err) => console.log(err))
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
        left={(props) => <List.Icon {...props} icon="email" />}
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

export default RequestComponent
