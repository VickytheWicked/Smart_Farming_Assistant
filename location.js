import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  PermissionsAndroid,
  Platform,
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
        sendToBackend(latitude, longitude); // ✅ Send to backend after getting coordinates
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
      const response = await fetch('http://192.168.0.217:5002/get-farming-advice', {  // 🔁 Replace with your machine's IP
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
      <Text style={styles.title}>📍 Get My Location</Text>
      <Button title="Fetch Location" onPress={getLocation} />

      {location && (
        <View style={styles.locationBox}>
          <Text style={styles.coordText}>Latitude: {location.latitude}</Text>
          <Text style={styles.coordText}>Longitude: {location.longitude}</Text>
        </View>
      )}
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  locationBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
  },
  coordText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
