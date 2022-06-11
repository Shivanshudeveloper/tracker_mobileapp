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
        sender: item.sender,
      }),
    })
      .then(() => {
        updateDoc(requestRef, {
          requestList: arrayUnion({
            requestStatus: 'accepted',
            companyName: item.companyName,
            sender: item.sender,
          }),
        })
      })
      .then(() => {
        const ref = doc(db, 'trackingWebNotification', item.sender.id)

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
      .then(async () => {
        const ref = collection(db, 'trackingUsers')
        const q = query(
          ref,
          where('phoneNumber', '==', phoneNumber),
          where('senderId', '==', item.sender.id),
        )

        const documents = await getDocs(q)

        documents.forEach((document) => {
          if (document.exists) {
            updateDoc(doc(db, 'trackingUsers', document.id), {
              trackingStatus: 'accepted',
            }).catch((err) => console.log(err))
          }
        })
      })
      .then(() => {
        const ref = doc(db, 'trackers', phoneNumber)
        setDoc(
          ref,
          {
            trackerList: arrayUnion(item.sender.id),
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
        sender: item.sender,
      }),
    })
      .then(() => {
        updateDoc(requestRef, {
          requestList: arrayUnion({
            requestStatus: 'rejected',
            companyName: item.companyName,
            sender: item.sender,
          }),
        })
      })
      .then(() => {
        const ref = doc(db, 'trackingWebNotification', item.sender.id)

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
      .then(async () => {
        const ref = collection(db, 'trackingUsers')
        const q = query(
          ref,
          where('phoneNumber', '==', phoneNumber),
          where('senderId', '==', item.sender.id),
        )

        const documents = await getDocs(q)

        documents.forEach((document) => {
          if (document.exists) {
            updateDoc(doc(db, 'trackingUsers', document.id), {
              trackingStatus: 'rejected',
            }).catch((err) => console.log(err))
          }
        })
      })
      .then(() => {
        const ref = doc(db, 'trackers', phoneNumber)
        setDoc(
          ref,
          {
            trackerList: arrayRemove(item.sender.id),
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

export default RequestComponent
