import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome } from "expo-vector-icons";
import { Camera } from "expo-camera";
import Photo from "./components/photo";
import AudioCard from "./components/audio";

export default App = () => {
  const url = "https://fba4-116-90-225-82.in.ngrok.io";
  const cameraRef = useRef(null);
  const [camPermission, setCamPermission] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const [fetchResponse, setFetchResponse] = useState(false);

  async function takePicture() {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let data = await cameraRef.current?.takePictureAsync(options);
    setPhotoData(data);
    setOpenModal(true);
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      //   console.log(status);
      if (status === "granted") setCamPermission(true);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {camPermission ? (
        <>
          {openModal ? (
            <>
              {fetchResponse ? (
                <AudioCard
                  url={url}
                  setFetchResponse={setFetchResponse}
                  setOpenModal={setOpenModal}
                />
              ) : (
                <Photo
                  photo={photoData}
                  openModal={openModal}
                  setOpenModal={setOpenModal}
                  url={url}
                  setFetchResponse={setFetchResponse}
                />
              )}
            </>
          ) : (
            <>
              <Camera
                style={{ flex: 0.75 }}
                type={Camera.Constants.Type.back}
                ref={cameraRef}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                  }}
                ></View>
              </Camera>

              <TouchableOpacity style={styles.button} onPress={takePicture}>
                <FontAwesome name="camera" size={23} color="#fff" />
              </TouchableOpacity>
            </>
          )}
        </>
      ) : (
        <Text>
          Permission for Camera not granted.Please change this in settings
        </Text>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  camContainer: {
    flex: 0.75,
    backgroundColor: "#fff",
    alighItems: "center",
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
  slider: {
    width: "70%",
  },
  audioButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
});
