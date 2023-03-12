import React from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { FontAwesome } from "expo-vector-icons";
// import * as FileSystem from "expo-file-system";

export const Photo = ({
  photo,
  openModal,
  setOpenModal,
  url,
  setFetchResponse,
}) => {
  let postJsonData = async () => {
    console.log("Fetch request");
    Alert.alert(
      "Loading...",
      "Image being sent to server and waiting for response",
      [],
      { cancelable: false }
    );
    await fetch(`${url}/SendImage`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "Rohan",
        image: photo["base64"],
      }),
    })
      .then((response) => {
        setFetchResponse(true);
        Alert.alert("Succesful", "Reply from server succesful");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error occured", "Server error , please try again");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Modal animationType="slide" transparent={false} visible={openModal}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            margin: 20,
          }}
        >
          <Image
            style={{ width: "100%", height: 500, borderRadius: 20 }}
            source={{ uri: "data:image/jpg;base64," + photo.base64 }}
          />
          <View style={{ margin: 10, flexDirection: "row" }}>
            <TouchableOpacity
              style={{ margin: 10 }}
              onPress={() => {
                setOpenModal(false);
              }}
            >
              <FontAwesome name="window-close" size={50} color="FF0000" />
            </TouchableOpacity>

            <TouchableOpacity style={{ margin: 10 }}>
              <FontAwesome
                name="upload"
                size={50}
                color="121212"
                onPress={postJsonData}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
});

export default Photo;
