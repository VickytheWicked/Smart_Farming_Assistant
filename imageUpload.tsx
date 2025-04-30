import React, { useState } from 'react';
import { View, Text, Button, Image, TextInput, Alert, StyleSheet } from 'react-native';
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
      const result = await axios.post('http://192.168.0.217:5001/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResponse(result.data.response);
    } catch (error) {
      Alert.alert("Error", "Failed to get response");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick from Gallery" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TextInput
        placeholder="Ask a question"
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title="Send to AI" onPress={sendToBackend} />
      {response ? <Text style={styles.response}>{response}</Text> : null}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  image: { width: 200, height: 200, marginVertical: 10 },
  input: { borderWidth: 1, padding: 10, marginVertical: 10 },
  response: { marginTop: 20, fontSize: 16 },
});

export default TextScreen;