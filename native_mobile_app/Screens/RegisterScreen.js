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
import { Button, Headline, TextInput, Subheading } from 'react-native-paper'

const RegisterScreen = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

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
          value={email}
          onChangeText={(email) => setEmail(email)}
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
          onPress={() => navigation.navigate('MainStack')}
        >
          Sign-UP
        </Button>
      </View>
      <View style={styles.registerLinkContainer}>
        <Subheading>Already have an account? </Subheading>
        <TouchableWithoutFeedback onPress={() => navigation.navigate('Login')}>
          <Subheading style={styles.registerLink}>Login here</Subheading>
        </TouchableWithoutFeedback>
      </View>
    </KeyboardAvoidingView>
  )
}

export default RegisterScreen

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
