import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Text,
  Switch,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import BackgroundImage from '@/assets/images/HomeBackground1.png';
import PlatformHeaderIcon from '@/assets/images/PlatformUpperIcon.png';

export default function PlatformScreen() {
  const [instagramConnected, setInstagramConnected] = useState(false);
  const [tiktokConnected, setTiktokConnected] = useState(false);

  // Track connection for Reddit, Facebook, Snapchat (start disconnected)
  // Now store connected AND switch value (true means switch ON)
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    Reddit: { connected: false, switchValue: false },
    Facebook: { connected: false, switchValue: false },
    Snapchat: { connected: false, switchValue: false },
  });

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [currentPlatform, setCurrentPlatform] = useState('');

  const platforms = [
    {
      name: 'Instagram',
      icon: require('@/assets/icons/InstagramLogo.png'),
      hasSwitch: true,
      value: instagramConnected,
      onValueChange: setInstagramConnected,
    },
    {
      name: 'TikTok',
      icon: require('@/assets/icons/TikTokLogo.png'),
      hasSwitch: true,
      value: tiktokConnected,
      onValueChange: setTiktokConnected,
    },
    {
      name: 'Reddit',
      icon: require('@/assets/icons/RedditLogo.png'),
    },
    {
      name: 'Facebook',
      icon: require('@/assets/icons/FacebookLogo.png'),
    },
    {
      name: 'Snapchat',
      icon: require('@/assets/icons/SnapchatLogo.png'),
    },
  ];

  const openModal = (platformName: string) => {
    setCurrentPlatform(platformName);
    setModalVisible(true);
  };

  const confirmConnect = () => {
    // Mark connected and set switch ON (true)
    setConnectedPlatforms((prev) => ({
      ...prev,
      [currentPlatform]: { connected: true, switchValue: true },
    }));
    setModalVisible(false);
  };

  const cancelConnect = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.backgroundWrapper}>
      <ImageBackground
        source={BackgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Image source={PlatformHeaderIcon} style={styles.headerImage} />
          <Text style={styles.title}>Platforms</Text>

          <View style={styles.platformList}>
            {platforms.map((platform, index) => {
              const isSwitchPlatform = platform.hasSwitch;
              const platformData = connectedPlatforms[platform.name];

              const isConnected = isSwitchPlatform
                ? platform.value
                : platformData?.connected || false;

              // For connected non-switch platforms, get switchValue
              const switchValue = isSwitchPlatform
                ? platform.value
                : platformData?.switchValue || false;

              return (
                <View key={index} style={styles.platformBox}>
                  <View style={styles.leftSection}>
                    <Image source={platform.icon} style={styles.platformIcon} />
                    <Text style={styles.platformText}>{platform.name}</Text>
                  </View>

                  {isSwitchPlatform || isConnected ? (
                    <Switch
                      trackColor={{ false: '#ccc', true: '#4cd964' }}
                      thumbColor="#fff"
                      ios_backgroundColor="#ccc"
                      onValueChange={
                        isSwitchPlatform
                          ? platform.onValueChange
                          : (val) =>
                              setConnectedPlatforms((prev) => ({
                                ...prev,
                                [platform.name]: {
                                  connected: true, // keep connected true always
                                  switchValue: val,
                                },
                              }))
                      }
                      value={switchValue}
                      style={styles.switch}
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.connectButton}
                      onPress={() => openModal(platform.name)}
                    >
                      <Text style={styles.connectButtonText}>Connect</Text>
                    </TouchableOpacity>
                  )}
                </View>
              );
            })}
          </View>

          <Modal
            visible={modalVisible}
            transparent
            animationType="fade"
            onRequestClose={cancelConnect}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>
                  Are you sure you want to connect to {currentPlatform}?
                </Text>
                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.modalButton, styles.modalYesButton]}
                    onPress={confirmConnect}
                  >
                    <Text style={styles.modalYesText}>Yes</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.modalButton, styles.modalNoButton]}
                    onPress={cancelConnect}
                  >
                    <Text style={styles.modalNoText}>No</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
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
  container: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: 'transparent',
    flexGrow: 1,
    alignItems: 'center',
  },
  platformList: {
    marginTop: 16,
    alignItems: 'center',
  },
  headerImage: {
    width: 999,
    height: 132,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    color: '#000',
    textAlign: 'left',
    fontFamily: 'Gabarito',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '600',
    lineHeight: 26,
    alignSelf: 'flex-start',
    marginLeft: 4,
    marginBottom: 16,
  },
  platformBox: {
    width: 300,
    height: 75,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 16,
    paddingRight: 16,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  platformIcon: {
    width: 41,
    height: 41,
    marginRight: 12,
  },
  platformText: {
    color: '#000',
    fontFamily: 'Gabarito',
    fontSize: 22,
    fontStyle: 'normal',
    fontWeight: '600',
  },
  switch: {
    width: 60,
    height: 33.261,
  },
  connectButton: {
    width: 80,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 90,
    backgroundColor: '#E0E1E2',
    paddingHorizontal: 12,
  },
  connectButtonText: {
    fontFamily: 'Gabarito',
    fontSize: 13,
    fontWeight: '600',
    color: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: 280,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontFamily: 'Gabarito',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 20,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalYesButton: {
    backgroundColor: '#4cd964',
  },
  modalYesText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  modalNoButton: {
    backgroundColor: '#E0E1E2',
  },
  modalNoText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});
