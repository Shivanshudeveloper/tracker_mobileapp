import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, List } from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'

const RequestComponent = (props) => {
  const { item, phoneNumber } = props
  console.log(item)
  const { companyName } = item

  const onAcceptRequest = () => {
    const requestRef = firestore()
      .collection('trackingRequest')
      .doc(phoneNumber)

    requestRef
      .update({
        requestList: firestore.FieldValue.arrayRemove({
          requestPending: true,
          requestAccepted: false,
          requestRejected: false,
          companyName: item.companyName,
          senderId: item.senderId,
        }),
      })
      .then(() => {
        requestRef.update({
          requestList: firestore.FieldValue.arrayUnion({
            requestPending: false,
            requestAccepted: true,
            requestRejected: false,
            companyName: item.companyName,
            senderId: item.senderId,
          }),
        })
      })
  }

  const onRejectRequest = () => {
    const requestRef = firestore()
      .collection('trackingRequest')
      .doc(phoneNumber)

    requestRef
      .update({
        requestList: firestore.FieldValue.arrayRemove({
          requestPending: true,
          requestAccepted: false,
          requestRejected: false,
          companyName: item.companyName,
          senderId: item.senderId,
        }),
      })
      .then(() => {
        requestRef.update({
          requestList: firestore.FieldValue.arrayUnion({
            requestPending: false,
            requestAccepted: false,
            requestRejected: true,
            companyName: item.companyName,
            senderId: item.senderId,
          }),
        })
      })
  }

  return (
    <>
      <List.Item
        title={`${companyName} has requested to track you`}
        description={() => (
          <View style={styles.listActionButtonContainer}>
            <Button
              style={{ margin: 3 }}
              mode='contained'
              icon='check'
              onPress={onAcceptRequest}
            >
              Accept
            </Button>
            <Button
              style={{ margin: 3 }}
              mode='contained'
              icon='close'
              onPress={onRejectRequest}
            >
              Reject
            </Button>
          </View>
        )}
        left={(props) => <List.Icon {...props} icon='email' />}
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
