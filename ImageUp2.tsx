import React, { useState } from 'react';
import {IMAGE_URL} from './utils/api'
import {
  View,
  Text,
  Button,
  Image,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';


const TextScreen = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (res) => {
      const asset = res.assets?.[0];
      if (asset?.uri) setImageUri(asset.uri);
      else Alert.alert("Error", "Image selection failed");
    });
  };

  const takePhoto = async () => {
    launchCamera({ mediaType: 'photo' }, (res) => {
      const asset = res.assets?.[0];
      if (asset?.uri) setImageUri(asset.uri);
      else Alert.alert("Error", "Camera failed or permission denied");
    });
  };

  const sendToBackend = async () => {
    if (!imageUri || !query) {
      Alert.alert("Error", "Both image and query are required");
      return;
    }

    const formData = new FormData();
    formData.append('query', query);
    formData.append('image', {
      uri: imageUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const result = await axios.post(`${IMAGE_URL}/analyze-image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { diagnosis, treatment } = result.data;
      setResponse(`🩺 Diagnosis:\n${diagnosis}\n\n🌿 Treatment:\n${treatment}`);
    } catch (error) {
      Alert.alert("Error", "Failed to get response");
      console.error(error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📷 Image Query Assistant</Text>
      <Text style={styles.subheader}>
        Upload an image and ask your question to receive AI assistance.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
          <Text style={styles.imageButtonText}>📁 Pick from Gallery</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
          <Text style={styles.imageButtonText}>📸 Take Photo</Text>
        </TouchableOpacity>
      </View>

      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <TextInput
        placeholder="Ask your question here..."
        placeholderTextColor="#ccc"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
        multiline
      />

      <TouchableOpacity style={styles.askButton} onPress={sendToBackend}>
        <Text style={styles.askButtonText}>🤖 Send to AI</Text>
      </TouchableOpacity>
      
      {response ? <Text style={styles.response}>{response}</Text> : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f172a',
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheader: {
    color: '#cbd5e1',
    fontSize: 15,
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 15,
  },
  imageButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 16,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  input: {
    backgroundColor: '#334155',
    color: '#fff',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    minHeight: 100,
  },
  askButton: {
    backgroundColor: '#10b981',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  askButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  responseContainer: {
    marginTop: 25,
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 12,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6ee7b7',
    marginBottom: 8,
  },
  response: {
    fontSize: 15,
    color: '#e2e8f0',
    lineHeight: 20,
  },
});

export default TextScreen;
