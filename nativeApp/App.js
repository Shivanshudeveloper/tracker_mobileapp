import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import Navigation from './Navigation'
// import { Provider as PaperProvider } from 'react-native-paper'
import { LogBox } from 'react-native'
import {
    MD3LightTheme as DefaultTheme,
    Provider as PaperProvider,
} from 'react-native-paper'

export default function App() {
    LogBox.ignoreLogs(['AsyncStorage has been extracted'])

    return (
        <PaperProvider>
            <SafeAreaProvider>
                <Navigation />
                <StatusBar style='auto' />
            </SafeAreaProvider>
        </PaperProvider>
    )
}
