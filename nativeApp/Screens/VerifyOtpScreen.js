import React, { useState, useEffect, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import Colors from '../constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import {
    KeyboardAvoidingView,
    StyleSheet,
    View,
    useColorScheme,
    Alert,
} from 'react-native'
import {
    Button,
    Headline,
    TextInput,
    Subheading,
    Snackbar,
} from 'react-native-paper'
import { FirebaseRecaptchaVerifierModal } from 'expo-firebase-recaptcha'
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth, app } from '../firebase'

const VerifyOtpScreen = (props) => {
    const recaptchaVerifier = useRef(null)

    const [code, setCode] = useState('')
    const [verificationId, setVerificationId] = useState()
    const [timer, setTimer] = useState(59)
    const [visible, setVisible] = useState(false)
    const [message, setMessage] = useState(null)

    const navigation = useNavigation()
    const colorScheme = useColorScheme()
    const { phoneNumber } = props.route.params
    let clockCall = null

    useEffect(() => {
        const signInWithPhoneNumber = async () => {
            try {
                const phoneProvider = new PhoneAuthProvider(auth)
                const verificationId = await phoneProvider.verifyPhoneNumber(
                    `+91${phoneNumber}`,
                    recaptchaVerifier.current
                )
                setVerificationId(verificationId)
                setMessage('Verification code has been sent to your phone.')
                setVisible(true)
            } catch (error) {
                setMessage(error.code.split('/')[1])
                setVisible(true)
            }
        }

        signInWithPhoneNumber()
    }, [])

    // resend timer
    useEffect(() => {
        clockCall = setInterval(() => {
            decrementClock()
        }, 1000)

        return () => clearInterval(clockCall)
    })

    const decrementClock = () => {
        if (timer === 0) {
            setTimer(0)
            clearInterval(clockCall)
        } else {
            setTimer(timer - 1)
        }
    }

    const verifyCode = async () => {
        try {
            const credential = PhoneAuthProvider.credential(
                verificationId,
                code
            )
            await signInWithCredential(auth, credential)
            clearInterval(clockCall)
            clearTimeout(0)
            navigation.replace('Root')
        } catch (err) {
            setMessage(`Error: ${err.message}`)
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
            <FirebaseRecaptchaVerifierModal
                ref={recaptchaVerifier}
                firebaseConfig={app.options}
                title='Prove you are human!'
                cancelLabel='Close'
            />
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
                    disabled={!verificationId}
                    mode='contained'
                    onPress={() => verifyCode()}
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
