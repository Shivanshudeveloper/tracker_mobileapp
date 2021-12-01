import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import {
  KeyboardAvoidingView,
  StyleSheet,
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
import auth from '@react-native-firebase/auth'

const VerifyOtpScreen = (props) => {
  const [code, setCode] = useState('')
  const [confirm, setConfirm] = useState(null)
  const [timer, setTimer] = useState(59)
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState(null)

  const navigation = useNavigation()
  const colorScheme = useColorScheme()

  const { phoneNumber } = props.route.params

  let clockCall = null

  // getting verification code
  const signInWithPhoneNumber = async () => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(
        `+91${phoneNumber}`,
        true
      )
      setConfirm(confirmation)
    } catch (error) {
      console.log(error)
      setMessage(error.code.split('/')[1])
      setVisible(true)
    }
  }

  useEffect(() => {
    signInWithPhoneNumber()
  }, [])

  // resend timer
  useEffect(() => {
    clockCall = setInterval(() => {
      decrementClock()
    }, 1000)

    return () => {
      clearInterval(clockCall)
    }
  })

  const decrementClock = () => {
    if (timer === 0) {
      setTimer(0)
      clearInterval(clockCall)
    } else {
      setTimer(timer - 1)
    }
  }

  // function to confirm code and
  // sending to main activity if authenticated
  const confirmCode = async () => {
    try {
      await confirm.confirm(code)
    } catch (error) {
      console.log(error)
      setMessage(error.code.split('/')[1])
      setVisible(true)
    }
  }

  // function to resend the code
  const resendCode = async () => {
    try {
      const confirmationLink = await auth().signInWithPhoneNumber(
        `+91${phoneNumber}`,
        true
      )
      setConfirm(confirmationLink)
      setTimer(59)
    } catch (error) {
      console.log(error)
      setMessage(error.code.split('/')[1])
      setVisible(true)
    }
  }

  const onDismissSnackBar = () => setVisible(false)

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
          We have sent a 6-digit verification code to
        </Subheading>
        <Subheading style={{ textAlign: 'center' }}>
          {`+91 ${phoneNumber}`}
        </Subheading>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          mode='outlined'
          label='Verification Code'
          value={code}
          onChangeText={(val) => setCode(val)}
        />
      </View>
      <View style={styles.buttonContainer}>
        {timer > 0 ? (
          <Button
            disabled
            labelStyle={styles.btnLabelStyle}
            style={styles.getCodeButton}
            mode='contained'
            onPress={() => resendCode()}
          >
            Resend
          </Button>
        ) : (
          <Button
            labelStyle={styles.btnLabelStyle}
            style={styles.getCodeButton}
            mode='contained'
            onPress={() => resendCode()}
          >
            Resend
          </Button>
        )}
        <Button
          labelStyle={styles.btnLabelStyle}
          style={styles.getCodeButton}
          mode='contained'
          onPress={() => confirmCode()}
        >
          Verify
        </Button>
      </View>
      <View style={styles.timerContainer}>
        <Subheading style={styles.timerText}>
          Resend code in {timer}s
        </Subheading>
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
  timerContainer: {
    marginVertical: 15,
  },
  timerText: {
    textAlign: 'center',
  },
})
