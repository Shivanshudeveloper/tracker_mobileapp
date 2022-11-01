import React from 'react'
import { Foundation } from '@expo/vector-icons'
import { StyleSheet, Text, View } from 'react-native'

const AnnotationComponent = (props) => {
  const { customisedName } = props
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{customisedName}</Text>
      </View>
      <Foundation style={styles.icon} name="marker" color="red" size={45} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 100,
    backgroundColor: 'transparent',
    height: 100,
  },
  textContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    paddingHorizontal: 5,
    flex: 1,
  },
  icon: {
    paddingTop: 10,
  },
})

export default AnnotationComponent
