import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from './ConversationsScreen';

export const ConversationItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Chat', { id: item.id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Text style={styles.name}>{item.name || 'Unnamed User'}</Text>
        <Text style={styles.email}>{item.email || 'No Email Provided'}</Text>
        {item.unSeenMessages > 0 && (
          <Text style={styles.unread}>Unread: {item.unSeenMessages}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
