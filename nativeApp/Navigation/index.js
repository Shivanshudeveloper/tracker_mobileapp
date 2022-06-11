import React, { useState, useEffect } from 'react'
import { Ionicons, FontAwesome5 } from '@expo/vector-icons'
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Colors from '../constants/Colors'
import useColorScheme from '../hooks/useColorScheme'

import HomeScreen from '../Screens/HomeScreen'
import NotificationScreen from '../Screens/NotificationScreen'
import LocationHistoryScreen from '../Screens/LocationHistoryScreen'
import SettingScreen from '../Screens/SettingScreen'
import LoginScreen from '../Screens/LoginScreen'
import VerifyOtpScreen from '../Screens/VerifyOtpScreen'
import TrackerListScreen from '../Screens/TrackerListScreen'

import { auth } from '../firebase'

const Navigation = ({ colorScheme }) => {
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState()

  // Handle user state changes
  async function onAuthStateChanged(user) {
    setUser(user)
    if (initializing) setInitializing(false)
  }

  useEffect(() => {
    return auth.onAuthStateChanged(onAuthStateChanged)
  }, [])

  if (initializing) return null

  if (user) {
    return (
      <NavigationContainer
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <RootNavigator />
      </NavigationContainer>
    )
  }

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <AuthNavigator />
    </NavigationContainer>
  )
}

const Stack = createNativeStackNavigator()
const BottomTab = createBottomTabNavigator()

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Root'
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Settings'
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='TrackerList'
        component={TrackerListScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const AuthNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Login'
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='VerifyOtp'
        component={VerifyOtpScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='MainStack'
        component={RootNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const BottomTabNavigator = () => {
  const colorScheme = useColorScheme()

  return (
    <BottomTab.Navigator
      initialRouteName='Home'
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors[colorScheme].tint,
        tabBarStyle: {
          paddingVertical: 10,
          height: 55,
        },
      }}
    >
      <BottomTab.Screen
        name='Home'
        component={HomeScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: () => (
            <>
              <IonIconIcon name='home' color='#007fff' />
            </>
          ),
        }}
      />
      <BottomTab.Screen
        name='Notification'
        component={NotificationScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IonIconIcon name='notifications' color='#007fff' />
          ),
        }}
      />
      <BottomTab.Screen
        name='Map'
        component={LocationHistoryScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <FontAwesome5
              style={{ marginBottom: -3 }}
              name='map-marked-alt'
              size={24}
              color='#007fff'
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  )
}

const IonIconIcon = (props) => {
  return (
    <Ionicons
      size={24}
      style={{ marginBottom: -3 }}
      color={props.color}
      name={props.name}
    />
  )
}

export default Navigation
