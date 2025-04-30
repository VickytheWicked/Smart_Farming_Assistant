import React, { useState } from 'react';
import {LOCATION_URL} from './utils/api'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';


const LocationScreen = () => {
  const [location, setLocation] = useState(null);

  const requestPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getLocation = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert("Permission Denied", "Location permission is required.");
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        sendToBackend(latitude, longitude);
      },
      error => {
        console.log(error.code, error.message);
        Alert.alert("Location Error", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };

  const sendToBackend = async (latitude, longitude) => {
    try {
      const response = await fetch(`${LOCATION_URL}/get-farming-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: latitude, lon: longitude }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("🌾 Farming Advice", result.advice);
      } else {
        Alert.alert("Error", result.error || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Network Error", "Could not connect to server.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📍 Location Based Farming</Text>
      <Text style={styles.subheader}>
        Tap the button below to fetch your location and get AI-driven farming tips.
      </Text>

      <TouchableOpacity style={styles.button} onPress={getLocation}>
        <Text style={styles.buttonText}>🎯 Get My Location</Text>
      </TouchableOpacity>

      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.coord}>📌 Latitude: {location.latitude.toFixed(6)}</Text>
          <Text style={styles.coord}>📌 Longitude: {location.longitude.toFixed(6)}</Text>
        </View>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 25,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  locationBox: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
  },
  coord: {
    color: '#e2e8f0',
    fontSize: 16,
    marginBottom: 10,
  },
});
