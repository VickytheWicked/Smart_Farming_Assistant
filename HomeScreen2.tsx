import React, { useState } from 'react';
import { AI_URL } from './utils/api';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Button,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './nav';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [query, setQuery] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${AI_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({query, model: "gemini-1.5-flash" })
      });

      const data = await response.json();
      console.log("Response from backend:", data);
      if (data.response) {
        Alert.alert("AI Response", data.response);
      } else {
        Alert.alert("Error", data.error || "No response");
      }
    } catch (error) {
      Alert.alert("Error", "Network request failed");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.header}>🌾 Farmer's Best Friend — AgroBuddy/</Text>
        <Text style={styles.subheader}>
          Hi! I'm <Text style={{ color: '#facc15' }}>AgroBuddy</Text>, your smart farming assistant. 
          Ask me anything — from crop suggestions to pest control and more. 🌾
          </Text>

        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="What's your query?"
          placeholderTextColor="#ccc"
          value={query}
          onChangeText={setQuery}
          multiline
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Ask AI</Text>
        </TouchableOpacity>

        <View style={styles.navButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Image')}>
            <Text style={styles.navButtonText}>🖼️ Upload an image</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate("location")}>
            <Text style={styles.navButtonText}>🔏location</Text>
          </TouchableOpacity>


          {/* <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home2')}
          >
            <Text style={styles.navButtonText}>🏡 Go to Home2</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a', // dark blue-gray
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    fontSize: 28,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    color: '#cbd5e1',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#334155',
    color: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;
