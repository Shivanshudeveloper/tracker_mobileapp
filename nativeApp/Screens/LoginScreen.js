import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import {
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from 'react-native'
import {
  Button,
  Headline,
  TextInput,
  Subheading,
  Snackbar,
} from 'react-native-paper'

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(null)

  const navigation = useNavigation()
  const colorScheme = useColorScheme()

  const onDismissSnackBar = () => setVisible(false)

  const getVerificationCode = () => {
    if (phoneNumber.length !== 10) {
      setMessage('10 digit phone number is required!')
      setVisible(true)
    } else {
      navigation.navigate('VerifyOtp', { phoneNumber })
    }
  }

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
      <View style={styles.inputContainer}>
        <TextInput
          mode='outlined'
          autoFocus={true}
          label='Phone Number'
          value={phoneNumber}
          onChangeText={(number) => setPhoneNumber(number)}
        />
      </View>
      <View style={styles.getCodeBtnContainer}>
        <Button
          labelStyle={styles.btnLabelStyle}
          style={styles.getCodeButton}
          mode='contained'
          onPress={() => getVerificationCode()}
        >
          Login
        </Button>
      </View>
      <View style={styles.registerLinkContainer}>
        <Subheading>Don't have an account? </Subheading>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Register')}
        >
          <Subheading style={styles.registerLink}>Sign-up for free</Subheading>
        </TouchableWithoutFeedback>
      </View>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'Close',
          onPress: () => {
            setVisible(false)
          },
        }}
      >
        {message}
      </Snackbar>
    </KeyboardAvoidingView>
  )
}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 70,
  },
  brandName: {
    fontSize: 30,
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  getCodeBtnContainer: {
    marginVertical: 15,
    width: '100%',
    paddingHorizontal: 30,
  },
  getCodeButton: {
    width: '100%',
  },
  btnLabelStyle: {
    paddingVertical: 10,
  },
  registerLinkContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 15,
  },
  registerLink: {
    color: '#007fff',
  },
})
