import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TShirtDesigner } from './TShirtDesigner';

export const DesignScreen = () => {
  return (
    <View style={styles.container}>
      <TShirtDesigner />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

