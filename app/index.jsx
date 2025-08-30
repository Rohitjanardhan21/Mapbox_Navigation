import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import Constants from 'expo-constants';
import styles from '../styles/Design_Home';

MapboxGL.setAccessToken(Constants.expoConfig.extra?.MAPBOX_ACCESS_TOKEN || '');

const Home = () => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await MapboxGL.requestAndroidLocationPermissions();
      setReady(true);
    })();
  }, []);

  if (!ready) return <ActivityIndicator size="large" />;

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        <MapboxGL.Camera 
          zoomLevel={15} 
          centerCoordinate={[77.4379, 12.8631]} 
          />
      </MapboxGL.MapView>
    </View>
  );
};

export default Home;
