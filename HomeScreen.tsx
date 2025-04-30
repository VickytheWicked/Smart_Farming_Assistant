import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,Alert,Button } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './nav';
import { useNavigation } from '@react-navigation/native';
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [role, setRole] = useState('');
  const [query, setQuery] = useState('');

  // 🧠 This is the main function that talks to your Flask backend
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://192.168.0.217:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, query, model:"gemini-1.5-flash" })
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
      <Text style={styles.header}>Farmer's Best Friend😊</Text>
      <Button title="Go to Camera" onPress={() => navigation.navigate('Text')} />
      <Button title="Go to Home2" onPress={() => navigation.navigate('Home2')} />
      <Text style={styles.subheader}>
        Hii i am CHATA your personal coding agent. Ask me your query....
      </Text>
      

      <TextInput
        style={styles.input}
        placeholder="Enter your role here"
        placeholderTextColor="#aaa"
        value={role}
        onChangeText={setRole}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your query here"
        placeholderTextColor="#aaa"
        value={query}
        onChangeText={setQuery}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    color: '#fff',
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
  input: {
    backgroundColor: '#222',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  pickerContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    marginBottom: 15,
  },
  picker: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;
