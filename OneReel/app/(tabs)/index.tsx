import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImageWithGemini } from '@/lib/gemini';
import * as ImageManipulator from 'expo-image-manipulator';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  type ImageData = {
    uri: string;
    description: string;
  };
  const [images, setImages] = useState<(ImageData | null)[]>([null, null, null, null, null, null]);

  const pickImage = async (index: number) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permissionResult.granted) {
    Alert.alert('Permission required', 'Please grant photo library access.');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: false,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;

    // Convert to base64
    const manipulated = await ImageManipulator.manipulateAsync(uri, [], { base64: true });
    const base64 = manipulated.base64 || '';

    // Call Gemini
    const description = await analyzeImageWithGemini(base64, 'Describe this image for AI search filtering');
    console.log('AI description:', description);

    const newImages = [...images];
    newImages[index] = { uri, description };
    setImages(newImages);
  }
};

  const renderSlot = (index: number, uri: string | null) => (
    <TouchableOpacity key={index} style={styles.imageSlot} onPress={() => pickImage(index)}>
      {uri ? (
        <Image source={{ uri }} style={styles.imagePreview} />
      ) : (
        <Text style={styles.placeholder}>+</Text>
      )}
    </TouchableOpacity>
  );


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        placeholder="Search..."
        placeholderTextColor="#999"
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchBar}
      />

      <View style={styles.gallery}>
        {images.map((img, index) => {
          if (!img) return renderSlot(index, null);

          const matchesSearch =
            searchText.trim() === '' ||
            new RegExp(searchText.trim(), 'i').test(img.description)

          return matchesSearch ? renderSlot(index, img.uri) : null;
        })}
      </View>

      {images.filter(img =>
        img && (
          searchText.trim() === '' ||
          new RegExp(searchText.trim(), 'i').test(img.description)
        )
      ).length === 0 && (
        <Text style={{ marginTop: 20, textAlign: 'center', color: '#666' }}>
          No matching results.
        </Text>
      )}
   
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 100,
    backgroundColor: 'white',
    flexGrow: 1,
  },
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  imageSlot: {
    width: '48%',
    height: 150,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  placeholder: {
    fontSize: 32,
    color: '#aaa',
  },
});
