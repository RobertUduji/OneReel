import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackgroundImage from '@/assets/images/HomeBackground1.png';
import ProfileUpperImage from '@/assets/images/ProfileUpperImage.png';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const pickImage = async () => {
    // Ask for permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.uri);
    }
  };

  return (
    <View style={styles.backgroundWrapper}>
      <ImageBackground
        source={BackgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <Image source={ProfileUpperImage} style={styles.headerImage} />

        <View style={styles.container}>
          <TouchableOpacity onPress={pickImage} style={styles.profilePicWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePic} />
            ) : (
              <View style={styles.placeholder} />
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundWrapper: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  headerImage: {
    width: 999,
    height: 150,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 100
    ,  // Increased to make room for the overlapping circle
  },
  profilePicWrapper: {
    position: 'absolute',
    top: -50,          // Adjust this value to move the circle up/down
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,  // half of width/height for a perfect circle
    borderWidth: 4,
    borderColor: '#795695',
    overflow: 'hidden',
    backgroundColor: 'lightgray',
  },
  profilePic: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    flex: 1,
    backgroundColor: 'lightgray',
  },
});
