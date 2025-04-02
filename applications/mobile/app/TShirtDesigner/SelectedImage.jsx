import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import React, { useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";

export const SelectedImage = ({
  selectedImages,
  view,
  image,
  index,
  selectedImageIndex,
  setSelectedImageIndex,
  setSelectedImages,
  killControls,
}) => {
  const [showControls, setShowControls] = useState(false);
  // const [dragging, setDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(1);
  const [sliderType, setSliderType] = useState("");
  const [showSlider, setShowSlider] = useState(false);

  const handleSliderChange = (value) => {
    const newImages = [...selectedImages[view]];
    if (sliderType === "resize") {
      newImages[selectedImageIndex].scale = value;
    } else if (sliderType === "rotate") {
      newImages[selectedImageIndex].rotate = value;
    }
    setSelectedImages({ ...selectedImages, [view]: newImages });
    setSliderValue(value);
  };

  // Use Animated.Value for smooth dragging
  const pan = useRef(new Animated.ValueXY({ x: image.x, y: image.y })).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // setDragging(true);
        // Update pan value for smooth dragging
        pan.setValue({
          x: image.x + gestureState.dx,
          y: image.y + gestureState.dy,
        });
      },
      onPanResponderRelease: () => {
        // setDragging(false);
        handleLongPress(index);
        // Update the image position after drag is complete
        const newImages = [...selectedImages[view]];
        newImages[index] = {
          ...newImages[index],
          x: pan.x._value, // Use pan.x._value for final position
          y: pan.y._value, // Use pan.y._value for final position
        };
        setSelectedImages({ ...selectedImages, [view]: newImages });
      },
    }),
  ).current;

  const showResizeSlider = () => {
    setSliderType("resize");
    setSliderValue(selectedImages[view][selectedImageIndex].scale);
    setShowSlider(true);
  };

  const showRotateSlider = () => {
    setSliderType("rotate");
    setSliderValue(selectedImages[view][selectedImageIndex].rotate);
    setShowSlider(true);
  };

  const handleLongPress = (index) => {
    setSelectedImageIndex(index);
    setShowControls(true);
  };

  const handleRemoveImage = () => {
    const newImages = selectedImages[view].filter((_, i) => i !== index);
    setSelectedImages({ ...selectedImages, [view]: newImages });
    setShowControls(false);
  };

  return (
    <View
      key={index}
      style={[styles.designImageContainer]}
      {...panResponder.panHandlers} // Attach panHandlers to the image container
    >
      <Animated.View
        style={[
          styles.designImage,
          {
            transform: [
              { scale: image.scale },
              { rotate: `${image.rotate}deg` },
              ...pan.getTranslateTransform(), // Bind pan animation to the transform property
            ],
          },
        ]}
      >
        <Image source={{ uri: image.uri }} style={styles.designImage} />
        {showControls && selectedImageIndex === index && (
          <>
            <TouchableOpacity
              style={styles.resizeIcon}
              onPress={showResizeSlider}
            >
              <Ionicons name="resize" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rotateIcon}
              onPress={showRotateSlider}
            >
              <Ionicons name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.pencilIcon}
              onPress={() => {
                /* Add your edit functionality here */
              }}
            >
              <Ionicons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeIcon}
              onPress={handleRemoveImage}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
      {showSlider && (
        <View style={styles.sliderContainer}>
          <Ionicons
            name={sliderType === "resize" ? "resize" : "refresh"}
            size={24}
            color="#fff"
            style={styles.sliderIcon}
          />
          <Slider
            style={styles.slider}
            minimumValue={sliderType === "resize" ? 0.5 : 0}
            maximumValue={sliderType === "resize" ? 2 : 360}
            value={sliderValue}
            onValueChange={handleSliderChange}
            thumbTintColor="blue"
          />
        </View>
      )}
    </View>
  );
};
