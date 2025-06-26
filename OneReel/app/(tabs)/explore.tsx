// app/intro.tsx
import React from 'react';
import { StyleSheet, ImageBackground, View, Text, Button } from 'react-native';
import { router } from 'expo-router';

export default function TabTwoScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/HomeBackground1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* <Text style={styles.text}>Welcome to OneReel</Text>
        <Button title="Get Started" onPress={() => router.replace('/(tabs)/index')} /> */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff'
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
