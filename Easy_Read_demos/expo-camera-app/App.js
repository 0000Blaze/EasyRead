import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome } from "expo-vector-icons";
// import { shareAsync } from "expo-sharing";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Permissions from "expo-permissions";
import { Audio } from "expo-av";

export default function App() {
  const cameraRef = useRef(null);
  const [type, settype] = useState(Camera.Constants.Type.back);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setopen] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasSoundPermission, setHasSoundPermission] = useState();
  const [photo, setPhoto] = useState();
  const [serverRply, setServerRply] = useState();
  const [encodedImage, setEncodedImage] = useState();
  const [sound, setSound] = useState();
  const [statusSound, setStatusSound] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      const soundPermission = await Audio.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
      setHasSoundPermission(soundPermission.status === "granted");
    })();
  }, []);

  if (hasCameraPermission === undefined || hasSoundPermission === undefined) {
    return <Text>Requesting permission...</Text>;
  } else if (!hasCameraPermission) {
    return (
      <Text>
        Permission for Camera not granted.Please change this in settings
      </Text>
    );
  } else if (!hasSoundPermission) {
    return (
      <Text>
        Permission for Sound not granted.Please change this in settings
      </Text>
    );
  }

  async function takePicture() {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };
    let data = await cameraRef.current.takePictureAsync(options);
    setCapturedPhoto(data["uri"]);
    setopen(true);
    setPhoto(data);
    setEncodedImage(data["base64"]);
  }

  if (photo) {
    async function soundLoad() {
      console.log("loading Sound");
      const { sound } = await Audio.Sound.createAsync({
        uri: "https://a8a4-27-34-16-89.in.ngrok.io/wav",
      });
      setSound(sound);
    }

    let postJsonData = () => {
      console.log("Loading ...");
      alert("Loading please wait");
      fetch("https://a8a4-27-34-16-89.in.ngrok.io/SendImage", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          something: "hi",
          image: encodedImage,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          setEncodedImage(undefined);
          setServerRply(responseJson);
          soundLoad();
          alert("Request succesful");
        })
        .catch((error) => {
          console.error(error);
          alert("Error occured try again");
        })
        .finally(() => setPhoto(undefined));
    };

    return (
      <SafeAreaView style={styles.container}>
        {capturedPhoto && (
          <Modal animationType="slide" transparent={false} visible={open}>
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
                    setopen(false);
                    setPhoto(undefined);
                  }}
                >
                  <FontAwesome name="window-close" size={50} color="FF0000" />
                </TouchableOpacity>

                <TouchableOpacity style={{ margin: 10 }} onPress={postJsonData}>
                  <FontAwesome name="upload" size={50} color="121212" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </SafeAreaView>
    );
  }

  if (serverRply) {
    let goBack = () => {
      setServerRply(undefined);
      setopen(false);
      setSound(undefined);
      setStatusSound(false);
      sound.unloadAsync();
    };

    async function playSound() {
      console.log("Playing Sound");
      await sound.playAsync();
      setStatusSound(true);
    }

    let pauseSound = () => {
      console.log("Pause Sound");
      sound.pauseAsync();
      setStatusSound(false);
    };

    return (
      <View style={styles.container}>
        <Button
          title={statusSound === false ? "Play" : "Pause"}
          onPress={statusSound === false ? playSound : pauseSound}
        />
        <Button title="Back" onPress={goBack} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={{ flex: 1 }} type={type} ref={cameraRef}>
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
    </SafeAreaView>
  );
}

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
});
