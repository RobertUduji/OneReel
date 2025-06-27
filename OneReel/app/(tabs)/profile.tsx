import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, Image, TouchableOpacity, Text, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import BackgroundImage from '@/assets/images/HomeBackground1.png';
import ProfileUpperImage from '@/assets/images/ProfileUpperImage.png';
import ProfileIcon from '@/assets/icons/ProfileIcon.png';
import PasswordIcon from '@/assets/icons/PasswordIcon.png';
import SecurityIcon from '@/assets/icons/SecurityIcon.png';
import ShareIcon from '@/assets/icons/ShareIcon.png';
import HistoryIcon from '@/assets/icons/HistoryIcon.png';

export default function ProfileScreen() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const sections = [
    { label: 'Edit Profile', icon: ProfileIcon },
    { label: 'Password', icon: PasswordIcon },
    { label: 'Security', icon: SecurityIcon },
    { label: 'Share', icon: ShareIcon },
    { label: 'History', icon: HistoryIcon },
  ];

  return (
    <View style={styles.backgroundWrapper}>
      <ImageBackground source={BackgroundImage} style={styles.backgroundImage} resizeMode="cover">
        <Image source={ProfileUpperImage} style={styles.headerImage} />

        <View style={styles.container}>
          <TouchableOpacity onPress={pickImage} style={styles.profilePicWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profilePic} />
            ) : (
              <View style={styles.placeholder} />
            )}
          </TouchableOpacity>

          <Text style={styles.nameText}>Michelle Dominguez</Text>
          <Text style={styles.emailText}>michelledom@gmail.com</Text>

          <View style={styles.optionsContainer}>
            {sections.map((item, idx) => (
              <TouchableOpacity key={idx} style={styles.optionRow} onPress={openModal}>
                <View style={styles.iconCircle}>
                  <Image source={item.icon} style={styles.iconImage} />
                </View>
                <Text style={styles.optionText}>{item.label}</Text>
                <Text style={styles.arrow}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ImageBackground>

      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>This doesn't do anything yet</Text>
            <TouchableOpacity onPress={closeModal} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: 100,
  },
  profilePicWrapper: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
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
  nameText: {
    marginTop: 15,
    color: '#000',
    textAlign: 'center',
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
  },
  emailText: {
    marginTop: 4,
    color: '#4C375D',
    textAlign: 'center',
    fontFamily: 'Gabarito',
    fontSize: 16,
    fontStyle: 'normal',
    fontWeight: '400',
    lineHeight: 24,
  },
  optionsContainer: {
    marginTop: 30,
    backgroundColor: 'white',
    borderRadius: 25,
    width: '90%',
    alignSelf: 'center',
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconImage: {
    width: 45,
    height: 45,
    resizeMode: 'contain',
  },
  optionText: {
    flex: 1,
    fontFamily: 'Gabarito',
    fontSize: 16,
    color: '#999',
  },
  arrow: {
    color: '#ccc',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 16,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: 'Gabarito',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#795695',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontFamily: 'Gabarito',
    fontSize: 16,
  },
});
