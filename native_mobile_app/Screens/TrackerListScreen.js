import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, List, Title, Dialog, Paragraph } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'

const TrackerListScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [visible, setVisible] = React.useState(false)

  const showDialog = () => setVisible(true)
  const hideDialog = () => setVisible(false)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

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
          <List.Item
            title='<Name>'
            description='Tracking Schedule'
            left={(props) => <List.Icon {...props} icon='email' />}
            right={() => (
              <View style={styles.actionBtnContainer}>
                <Button mode='contained' onPress={showDialog}>
                  Turn off Tracking
                </Button>
              </View>
            )}
          />
          <List.Item
            title='<Name>'
            description='Tracking Schedule'
            left={(props) => <List.Icon {...props} icon='email' />}
            right={() => (
              <View style={styles.actionBtnContainer}>
                <Button mode='contained' onPress={showDialog}>
                  Turn off Tracking
                </Button>
              </View>
            )}
          />
          <List.Item
            title='<Name>'
            description='Tracking Schedule'
            left={(props) => <List.Icon {...props} icon='email' />}
            right={() => (
              <View style={styles.actionBtnContainer}>
                <Button mode='contained' onPress={showDialog}>
                  Turn off Tracking
                </Button>
              </View>
            )}
          />
        </View>
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
            <Button onPress={hideDialog}>Turn off Tracking</Button>
          </Dialog.Actions>
        </Dialog>
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
