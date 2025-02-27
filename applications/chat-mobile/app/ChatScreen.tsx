import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert, ScrollView, Modal, Share } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [styles, setStyles] = useState(getStyles({
    hasImages: selectedImages.length > 0
  }));
  const navigation = useNavigation();

  useEffect(() => {
    setStyles(getStyles(
      {
        hasImages: selectedImages.length > 0
      }
    ));
  }, [selectedImages]);

  const sendMessage = () => {
    if (input.trim() || selectedImages.length > 0) {
      const newMessage = { 
        id: Date.now().toString(), 
        text: input, 
        sender: 'user', 
        images: selectedImages 
      };

      setMessages([...messages, newMessage]);
      setInput('');
      setSelectedImages([]);
    }
  };

  const handlePhotoButtonPress = () => {
    Alert.alert(
      "Upload Photo",
      "Choose an option",
      [
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImages([...selectedImages, result.assets[0].uri]);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImages([...selectedImages, result.uri]);
    }
  };

  const removeImage = (uri) => {
    setSelectedImages(selectedImages.filter(image => image !== uri));
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessage : styles.otherMessage]}>
      {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}
      {item.images?.length > 0 && (
        <View style={styles.imageContainer}>
          {item.images.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => openModal(image)}>
              <Image source={{ uri: image }} style={styles.messageImage} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const openModal = (image) => {
    setModalImage(image);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalImage(null);
  };

  const shareImage = async () => {
    try {
      await Share.share({
        url: modalImage,
      });
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.messagesList}
        inverted
      />
      {selectedImages.length > 0 && (
        <ScrollView horizontal style={styles.previewContainer}>
          {selectedImages.map((image, index) => (
            <View key={index} style={styles.previewItem}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity onPress={() => removeImage(image)} style={styles.removeButton}>
                <Ionicons name="close" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={handlePhotoButtonPress} style={styles.photoButton}>
          <Ionicons name="camera" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Design')} style={styles.designButton}>
          <Ionicons name="brush" size={24} color="#007AFF" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Enter your message here"
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <Image source={{ uri: modalImage }} style={styles.modalImage} />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Ionicons name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareImage} style={styles.shareButton}>
            <Ionicons name="share-social" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const getStyles = ({hasImages = false})=> StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messagesList: {
    paddingHorizontal: 10,
    height: '80%',
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 20,
    maxHeight: hasImages? '80%' : '100%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5E5EA',
  },
  messageText: {
    color: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  messageImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    margin: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
    minHeight: 40,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  photoButton: {
    marginRight: 10,
    position: 'relative',
  },
  designButton: {
    marginRight: 10,
  },
  photoCount: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    padding: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCountText: {
    color: '#fff',
    fontSize: 12,
  },
  thumbnailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 10,
    marginLeft: 5,
  },
  previewContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  previewItem: {
    position: 'relative',
    marginRight: 10,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#ff0000',
    borderRadius: 10,
    padding: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  shareButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
});

