import * as React from 'react'
import { useNavigation } from '@react-navigation/native'
import { Appbar, Menu, Divider } from 'react-native-paper'

const AppBar = ({ title, onPress, menuVisible, closeMenu }) => {
  const navigation = useNavigation()

  const goToSettingPage = () => {
    closeMenu()
    navigation.navigate('Settings')
  }

  return (
    <Appbar.Header>
      <Appbar.Content
        titleStyle={{ textTransform: 'uppercase' }}
        title={title}
      />
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={
          <Appbar.Action
            color='white'
            icon='account-circle'
            onPress={onPress}
          />
        }
      >
        <Menu.Item onPress={() => goToSettingPage()} title='Settings' />
        <Divider />
        <Menu.Item onPress={closeMenu} title='Logout' />
      </Menu>
    </Appbar.Header>
  )
}

export default AppBar
