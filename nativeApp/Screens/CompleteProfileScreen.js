import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import {
  StyleSheet,
  View,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native'
import { Avatar, TextInput } from 'react-native-paper'

const CompleteProfileScreen = (props) => {
  const {
    image,
    profilePicture,
    pickImage,
    name,
    setName,
    setVisible,
    phoneNumber,
  } = props

  const tempProfilePicture =
    'https://th.bing.com/th/id/R.5689eb0c1f8885cba336549b673f7d3f?rik=ePBvnQFcVJEh9w&riu=http%3a%2f%2fwww.divestco.com%2fwp-content%2fuploads%2f2017%2f08%2fperson-placeholder-portrait.png&ehk=JXsLtzvuMmYKSw5OtqOOnZ0%2b0c9jpOp8afo9fIbbSK0%3d&risl=&pid=ImgRaw&r=0'
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.imageContainer}>
          {image !== null ? (
            <Avatar.Image
              size={150}
              source={{
                uri: image,
              }}
              style={{ backgroundColor: '#ededed' }}
            />
          ) : (
            <Avatar.Image
              size={150}
              source={{
                uri:
                  profilePicture.length === 0
                    ? tempProfilePicture
                    : profilePicture,
              }}
              style={{ backgroundColor: '#ededed' }}
            />
          )}

          <TouchableOpacity style={styles.camera} onPress={pickImage}>
            <Ionicons name='camera' size={24} color='white' />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.editText}
            mode='outlined'
            label='Full Name'
            value={name}
            onChangeText={(name) => setName(name)}
          />
          <TextInput
            style={styles.editText}
            mode='outlined'
            label='Phone Number'
            value={phoneNumber}
            disabled
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default CompleteProfileScreen

const styles = StyleSheet.create({
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginVertical: 10,
    position: 'relative',
  },
  camera: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'gray',
    borderRadius: 50,
    padding: 7,
  },
  brandContainer: {
    marginBottom: 30,
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
