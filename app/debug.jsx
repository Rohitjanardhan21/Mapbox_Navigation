import { View, Text, StyleSheet } from 'react-native';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken('pk.eyJ1IjoiYmVyaWNrcyIsImEiOiJjbWVkMmxhdDIwNXdyMmxzNTA3ZnprMHk3In0.hE8cQigI9JFbb9YBHnOsHQ');

export default function Debug() {
  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/streets-v11"
      >
        <MapboxGL.Camera
          zoomLevel={14}
          centerCoordinate={[77.4379, 12.8631]}
        />
      </MapboxGL.MapView>
      <View style={styles.overlay}>
        <Text style={styles.text}>Map Debug View</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
