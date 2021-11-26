import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, List } from 'react-native-paper'
import AppBar from '../Components/AppBarComponent'

const SettingScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const [expanded, setExpanded] = React.useState(true)

  const handlePress = () => setExpanded(!expanded)

  const openMenu = () => setMenuVisible(true)
  const closeMenu = () => setMenuVisible(false)

  return (
    <View style={styles.container}>
      <AppBar
        onPress={openMenu}
        closeMenu={closeMenu}
        title='Settings'
        menuVisible={menuVisible}
      />
      <View style={styles.saveBtnContainer}>
        <Button mode='contained'>Save</Button>
      </View>
      <View style={styles.mainContainer}>
        <List.Section>
          <List.Accordion
            title='Profile'
            expanded={expanded}
            onPress={handlePress}
          >
            <List.Item
              title='Name'
              right={(props) => <List.Icon {...props} icon='pencil' />}
            />
            <List.Item
              title='Phone Number'
              right={(props) => <List.Icon {...props} icon='pencil' />}
            />
            <List.Item
              title='Profle Photo'
              right={(props) => <List.Icon {...props} icon='camera' />}
            />
          </List.Accordion>

          <List.Accordion title='Security'>
            <List.Item title='Your Permissions' />
          </List.Accordion>

          <List.Accordion title='Groups and Hotspots'>
            <List.Item title='Your Groups' />
            <List.Item title='Your Hotspots' />
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
  saveBtnContainer: {
    display: 'flex',
    flexDirection: 'row-reverse',
    margin: 10,
  },
  mainContainer: {
    padding: 10,
    position: 'relative',
  },
})
