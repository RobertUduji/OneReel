import React, { useState } from 'react';
import {
  View, TextInput, StyleSheet, Image, TouchableOpacity, Text,
  ScrollView, Alert, Modal
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { analyzeImageWithGemini } from '@/lib/gemini';
import * as ImageManipulator from 'expo-image-manipulator';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { Video } from 'expo-av';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [currentVideoUri, setCurrentVideoUri] = useState<string | null>(null);

  type ImageData = {
    uri: string;
    previewUri: string;
    description: string;
    type: 'image' | 'video';
  };

  const [images, setImages] = useState<(ImageData | null)[]>([null, null, null, null, null, null]);

  const pickMedia = async (index: number) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Please grant photo library access.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      base64: false,
      quality: 0.8,
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    const uri = asset.uri;
    let description = '';
    const newImages = [...images];

    if (asset.type === 'video') {
      try {
        const frameTimes = [0, 5000, 10000, 15000, 20000];
        const framePromises = frameTimes.map(async (time) => {
          const { uri: thumbUri } = await VideoThumbnails.getThumbnailAsync(uri, { time });
          const manipulated = await ImageManipulator.manipulateAsync(thumbUri, [], { base64: true });
          const base64 = manipulated.base64 || '';
          const frameDescription = await analyzeImageWithGemini(base64, 'Summarize this frame for video search');
          console.log(`🟩 Frame at ${time}ms:`, frameDescription);
          return frameDescription;
        });

        const frameDescriptions = await Promise.all(framePromises);
        description = frameDescriptions.join(' ');

        const { uri: previewUri } = await VideoThumbnails.getThumbnailAsync(uri, { time: 0 });

        newImages[index] = {
          uri,
          previewUri,
          description,
          type: 'video',
        };
      } catch (error) {
        console.error('Error processing video:', error);
        Alert.alert('Error', 'Failed to process video frames.');
        return;
      }
    }

   else {
    const manipulated = await ImageManipulator.manipulateAsync(uri, [], { base64: true });
  const base64 = manipulated.base64 || '';
  description = await analyzeImageWithGemini(base64, 'Describe this image for AI search filtering');

  newImages[index] = {
    uri,
    previewUri: uri,
    description,
    type: 'image',
  };
}

console.log('AI description:', description);
setImages(newImages);
  };

const renderSlot = (index: number, uri: string | null, type?: 'image' | 'video') => (
  <TouchableOpacity
    key={index}
    style={styles.imageSlot}
    onPress={() => {
      if (uri && type === 'video') {
        setCurrentVideoUri(uri);
        setModalVisible(true);
      } else {
        pickMedia(index);
      }
    }}
  >
    {uri ? (
      <View style={{ position: 'relative', width: '100%', height: '100%' }}>
        <Image source={{ uri: images[index]?.previewUri }} style={styles.imagePreview} />
        {type === 'video' && <Text style={styles.playIcon}>▶</Text>}
      </View>
    ) : (
      <Text style={styles.placeholder}>+</Text>
    )}
  </TouchableOpacity>
);

return (
  <>
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
            new RegExp(searchText.trim(), 'i').test(img.description);

          return matchesSearch ? renderSlot(index, img.uri, img.type) : null;
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

    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
        <Video
          source={{ uri: currentVideoUri || '' }}
          useNativeControls
          resizeMode="contain"
          style={{ width: '100%', height: 300 }}
        />
        <TouchableOpacity
          onPress={() => setModalVisible(false)}
          style={{ marginTop: 20, padding: 10, backgroundColor: 'white', borderRadius: 8 }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  </>
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
  playIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    fontSize: 24,
    color: 'white',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    paddingHorizontal: 6,
  },
});
