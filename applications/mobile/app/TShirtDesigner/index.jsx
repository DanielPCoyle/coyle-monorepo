import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SelectedImage } from "./SelectedImage";
import { styles } from "./styles";
import { ViewButtons } from "./ViewButtons";

export const TShirtDesigner = () => {
  const [selectedImages, setSelectedImages] = useState({
    front: [],
    back: [],
    left: [],
    right: [],
  });
  const [text, setText] = useState("");
  const [view, setView] = useState("front");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImages({
        ...selectedImages,
        [view]: [
          ...selectedImages[view],
          { uri: result.assets[0].uri, x: 0, y: 0, scale: 1, rotate: 0 },
        ],
      });
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImages({
        ...selectedImages,
        [view]: [
          ...selectedImages[view],
          { uri: result.assets[0].uri, x: 0, y: 0, scale: 1, rotate: 0 },
        ],
      });
    }
  };

  const renderTShirtImage = () => {
    switch (view) {
      case "front":
        return require("../../assets/images/shirt.jpg");
      case "back":
        return require("../../assets/images/shirt.jpg");
      case "left":
        return require("../../assets/images/shirt.jpg");
      case "right":
        return require("../../assets/images/shirt.jpg");
      default:
        return require("../../assets/images/shirt.jpg");
    }
  };

  return (
    <View style={styles.container}>
      <ViewButtons setView={setView} />
      <View style={styles.tshirtContainer}>
        <Image source={renderTShirtImage()} style={styles.tshirtImage} />
        {selectedImages[view].map((image, index) => (
          <SelectedImage
            key={index}
            image={image}
            index={index}
            selectedImages={selectedImages}
            selectedImageIndex={selectedImageIndex}
            view={view}
            setSelectedImageIndex={setSelectedImageIndex}
            setSelectedImages={setSelectedImages}
          />
        ))}
        <Text style={styles.designText}>{text}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity onPress={pickImage} style={styles.button}>
          <Ionicons name="image" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={takePhoto} style={styles.button}>
          <Ionicons name="camera" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter text"
          value={text}
          onChangeText={setText}
        />
      </View>
    </View>
  );
};
