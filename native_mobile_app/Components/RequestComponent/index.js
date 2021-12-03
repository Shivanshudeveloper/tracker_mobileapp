import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, List } from 'react-native-paper'
import database from '@react-native-firebase/database'

const RequestComponent = (props) => {
  const { item, phoneNumber } = props
  const { requestId } = item
  const { companyName } = item.values
  const { requestPending } = item.values

  const [requestAccepted, setRequestAccepted] = useState(false)

  useEffect(() => {
    const acceptRef = database().ref(
      `trackerapp/trackingAccepted/${phoneNumber}/${requestId}`
    )
    acceptRef.on('value', (snapshot) => {
      if (snapshot !== null && snapshot.exists()) {
        const data = snapshot.val()
        setRequestAccepted(data.requestAccepted)
      }
    })
  }, [])

  const onAcceptrequest = () => {
    const requestRef = database().ref(
      `trackerapp/trackingRequested/${phoneNumber}/${requestId}`
    )
    const acceptRef = database().ref(
      `trackerapp/trackingAccepted/${phoneNumber}/${requestId}`
    )
    requestRef
      .update({
        requestPending: false,
      })
      .catch((error) => console.log(error))

    acceptRef
      .update({
        requestAccepted: true,
      })
      .catch((error) => console.log(error))
  }

  const onRejectRequest = () => {
    const requestRef = database().ref(
      `trackerapp/trackingRequested/${phoneNumber}/${requestId}`
    )
    const acceptRef = database().ref(
      `trackerapp/trackingAccepted/${phoneNumber}/${requestId}`
    )
    requestRef
      .update({
        requestPending: false,
      })
      .catch((error) => console.log(error))

    acceptRef
      .update({
        requestAccepted: false,
      })
      .catch((error) => console.log(error))
  }

  return (
    <>
      {!requestAccepted && requestPending && (
        <List.Item
          title={`${companyName} has requested to track you`}
          description={() => (
            <View style={styles.listActionButtonContainer}>
              <Button
                style={{ margin: 3 }}
                mode='contained'
                icon='check'
                onPress={onAcceptrequest}
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
      )}
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
