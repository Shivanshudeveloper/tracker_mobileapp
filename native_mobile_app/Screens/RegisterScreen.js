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
  ScrollView,
  SafeAreaView,
} from 'react-native'
import {
  Button,
  Headline,
  TextInput,
  Subheading,
  Snackbar,
} from 'react-native-paper'
import AsyncStorage from '@react-native-async-storage/async-storage'

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(null)

  const navigation = useNavigation()
  const colorScheme = useColorScheme()

  const emailRegex =
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

  const checkValidityandGetCode = () => {
    if (!emailRegex.test(emailAddress)) {
      setMessage('Email is invalid')
      setVisible(true)
    } else if (fullName === '' || phoneNumber === '') {
      setMessage('All fields are required')
      setVisible(true)
    } else if (phoneNumber.length !== 10) {
      setMessage('10 digit phone number is required!')
      setVisible(true)
    } else {
      getVerificationCode()
    }
  }

  const getVerificationCode = async () => {
    try {
      const data = {
        fullName,
        emailAddress,
        phoneNumber,
      }
      await AsyncStorage.setItem('userInfo', JSON.stringify(data))

      navigation.navigate('VerifyOtp', { phoneNumber })
    } catch (error) {
      console.log(error)
      setMessage(error.message)
      setVisible(true)
    }
  }

  const onDismissSnackBar = () => setVisible(false)

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
            style={styles.editText}
            mode='outlined'
            label='Full Name'
            value={fullName}
            onChangeText={(name) => setFullName(name)}
          />
          <TextInput
            style={styles.editText}
            mode='outlined'
            label='Email Address'
            value={emailAddress}
            onChangeText={(email) => setEmailAddress(email)}
          />
          <TextInput
            style={styles.editText}
            mode='outlined'
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
            onPress={() => checkValidityandGetCode()}
          >
            Sign-UP
          </Button>
        </View>
        <View style={styles.registerLinkContainer}>
          <Subheading>Already have an account? </Subheading>
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate('Login')}
          >
            <Subheading style={styles.registerLink}>Login here</Subheading>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
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
    </SafeAreaView>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 150,
    paddingBottom: 25,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 60,
  },
  brandName: {
    fontSize: 30,
    marginLeft: 10,
  },
  inputContainer: {
    width: '100%',
    paddingHorizontal: 30,
  },
  editText: {
    marginVertical: 5,
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
