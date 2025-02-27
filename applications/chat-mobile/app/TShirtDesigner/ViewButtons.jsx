import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';

export const ViewButtons = ({ setView }) => {
  return <View style={styles.viewButtons}>
    <TouchableOpacity onPress={() => setView('front')} style={styles.viewButton}>
      <Text style={styles.viewButtonText}>Front</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setView('back')} style={styles.viewButton}>
      <Text style={styles.viewButtonText}>Back</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setView('left')} style={styles.viewButton}>
      <Text style={styles.viewButtonText}>Left</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => setView('right')} style={styles.viewButton}>
      <Text style={styles.viewButtonText}>Right</Text>
    </TouchableOpacity>
  </View>;
};
