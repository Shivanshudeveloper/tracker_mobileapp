import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  useColorScheme,
} from 'react-native'
import { Button, Headline, TextInput, Subheading } from 'react-native-paper'

const VerifyOtpScreen = () => {
  const [code, setCode] = useState('')

  const navigation = useNavigation()
  const colorScheme = useColorScheme()

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.brandContainer}>
        <Ionicons
          name='location-sharp'
          size={30}
          color={Colors[colorScheme].text}
        />
        <Headline style={styles.brandName}>GPS REPORT</Headline>
      </View>
      <View style={styles.subHeadingContainer}>
        <Subheading style={{ textAlign: 'center' }}>
          We have sent a 6-digit verification code to XXX-XXX-XXXX
        </Subheading>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          mode='outlined'
          label='Verification Code'
          value={code}
          onChangeText={(code) => setCode(code)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          labelStyle={styles.btnLabelStyle}
          style={styles.getCodeButton}
          mode='contained'
        >
          Resend
        </Button>
        <Button
          labelStyle={styles.btnLabelStyle}
          style={styles.getCodeButton}
          mode='contained'
          onPress={() => navigation.navigate('MainStack')}
        >
          Verify
        </Button>
      </View>
    </KeyboardAvoidingView>
  )
}

export default VerifyOtpScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 50,
  },
  brandName: {
    fontSize: 30,
    marginLeft: 10,
  },
  subHeadingContainer: {
    marginBottom: 20,
    marginHorizontal: 30,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginVertical: 20,
  },
  btnLabelStyle: {
    paddingVertical: 7,
    paddingHorizontal: 21,
  },
})
