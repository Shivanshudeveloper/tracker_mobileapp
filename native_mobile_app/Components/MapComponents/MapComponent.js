import React from 'react'
import { StyleSheet, View } from 'react-native'
import MapboxGL from '@react-native-mapbox-gl/maps'
import Logger from '@react-native-mapbox-gl/maps/javascript/utils/Logger'
import AnnotationComponent from './AnnotationComponent'

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic2hpdmFuc2h1OTgxIiwiYSI6ImNrdmoyMjh5bDJmeHgydXAxem1sbHlhOXQifQ.2PZhm_gYI4mjpPyh7xGFSw'
)

const MapComponent = (props) => {
  const { longitude, latitude } = props

  Logger.setLogCallback((log) => {
    const { message } = log

    if (
      message.match('Request failed due to a permanent error: Canceled') ||
      message.match('Request failed due to a permanent error: Socket Closed')
    ) {
      return true
    }
    return false
  })

  return (
    <View style={styles.mapContainer}>
      <MapboxGL.MapView
        style={styles.map}
        zoomEnabled={true}
        compassEnabled={true}
        rotateEnabled={false}
        logoEnabled={false}
        localizeLabels={true}
      >
        <MapboxGL.Camera
          zoomLevel={15}
          animationMode={'flyTo'}
          animationDuration={1100}
          centerCoordinate={[longitude, latitude]}
        />
        <View>
          <MapboxGL.MarkerView id={1} coordinate={[longitude, latitude]}>
            <View>
              <AnnotationComponent customisedName={'My Location'} />
            </View>
          </MapboxGL.MarkerView>
        </View>
      </MapboxGL.MapView>
    </View>
  )
}

export default MapComponent

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: 250,
  },
  mapContainer: {
    width: '100%',
  },
})
