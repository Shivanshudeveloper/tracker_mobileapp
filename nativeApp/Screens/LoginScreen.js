import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../constants/Colors'
import { KeyboardAvoidingView, StyleSheet, View, LogBox } from 'react-native'
import { Button, Headline, TextInput, Snackbar } from 'react-native-paper'

const LoginScreen = () => {
    const [phoneNumber, setPhoneNumber] = useState('')
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)

    const navigation = useNavigation()

    LogBox.ignoreLogs(['AsyncStorage has been extracted'])

    const onDismissSnackBar = () => setVisible(false)

    const getVerificationCode = () => {
        if (!phoneNumber.startsWith('+')) {
            setMessage(
                'Please include a valid country code, example: +911234567890'
            )
            setVisible(true)
        } else {
            navigation.navigate('VerifyOtp', { phoneNumber })
        }
    }

    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={styles.brandContainer}>
                <Ionicons name='location-sharp' size={30} color='red' />
                <Headline style={styles.brandName}>GPS REPORT</Headline>
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    mode='outlined'
                    autoFocus={true}
                    label='Phone Number'
                    value={phoneNumber}
                    placeholder='+911234567890'
                    onChangeText={(number) => setPhoneNumber(number)}
                    activeOutlineColor='#007bff'
                    style={{ backgroundColor: 'white' }}
                    selectionColor='#007bff'
                    theme={{ colors: { text: 'black' } }}
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
        backgroundColor: 'white',
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
        color: 'black',
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
        backgroundColor: '#007bff',
    },
    btnLabelStyle: {
        paddingVertical: 10,
        fontWeight: 'bold',
        color: 'white',
        fontSize: 16,
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
