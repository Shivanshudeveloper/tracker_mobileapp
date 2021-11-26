import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from './Navigation'
import useColorScheme from './hooks/useColorScheme'
import { Provider as PaperProvider } from 'react-native-paper'

export default function App() {
  const colorScheme = useColorScheme()

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar style='auto' />
      </SafeAreaProvider>
    </PaperProvider>
  )
}
