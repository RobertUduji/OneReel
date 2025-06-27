import React from 'react';
import { StyleSheet, ImageBackground, View, Text } from 'react-native';

export default function TabTwoScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/HomeBackground1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.text}>This page is under development</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#795695', // purple
    fontSize: 20,
    fontWeight: 'bold',
  },
});
