import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const CustomActions = ({ name, wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
  const actionSheet = useActionSheet();

  // Display action sheet with options for sending images or location
  const onActionPress = () => {
    const options = ["Choose From Library", "Take Picture", "Send Location", "Cancel"];
    const cancelButtonIndex = options.length - 1;

    actionSheet.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            pickImage();
            return;
          case 1:
            takePhoto();
            return;
          case 2:
            getLocation();
            return;
          default:
        }
      }
    );
  };

  // Option for user to choose an image from gallery
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      // opening gallery for choosing image
        const result = await ImagePicker.launchImageLibraryAsync();
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Option for user to upload image live from camera
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.granted) {
      // opening camera for taking photo
        const result = await ImagePicker.launchCameraAsync();
      if (!result.canceled) {
        await uploadAndSendImage(result.assets[0].uri);
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Option for user to send their current location
  const getLocation = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.granted) {
      // fetcching users current location
      const location = await Location.getCurrentPositionAsync({});
      if (location) {
        onSend([{
          _id: `${new Date().getTime()}-${userID}`,
          user: { _id: userID, name },
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }]);
      } else {
        Alert.alert("Error occurred while fetching location.");
      }
    } else {
      Alert.alert("Permissions haven't been granted.");
    }
  };

  // Generate a unique reference for the uploaded image
  const generateReference = (uri) => {
    const timeStamp = new Date().getTime();
    const imageName = uri.split("/").pop();
    return `${userID}-${timeStamp}-${imageName}`;
  };

  // Upload the image to Firebase Storage and send it
  const uploadAndSendImage = async (imageURI) => {
    try {
      // uploading and extracting image url
      const uniqueRefString = generateReference(imageURI);
      const newUploadRef = ref(storage, uniqueRefString);
      const response = await fetch(imageURI);
      const blob = await response.blob();
      await uploadBytes(newUploadRef, blob);
      const imageURL = await getDownloadURL(newUploadRef);
      const image = {
        _id: `${new Date().getTime()}-${userID}`,
        user: { _id: userID, name: name }, 
        image: imageURL,
      }
      // calling send function in parent component
      onSend([image]);
    } catch (error) {
      Alert.alert("Error uploading image. Please try again.");
    }
  };

  return (
    <TouchableOpacity
      accessible={true}
      accessibilityLabel="More options"
      accessibilityHint="Choose to send an image, take a photo, or send your location."
      style={[styles.container, wrapperStyle]}
      onPress={onActionPress}
    >
      {/* Button for displaying the action sheet */}
      <View style={[styles.wrapper, wrapperStyle]}>
        <Text style={[styles.iconText, iconTextStyle]}>+</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 16,
    borderColor: "#00000",
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: "#00000",
    fontWeight: "bold",
    fontSize: 16,
    backgroundColor: "transparent",
    textAlign: "center",
  },
});

export default CustomActions;