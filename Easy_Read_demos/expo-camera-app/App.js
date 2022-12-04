import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Modal,
} from "react-native";
import Slider from "@react-native-community/slider";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome } from "expo-vector-icons";
import { Camera } from "expo-camera";
import { Audio } from "expo-av";

export default function App() {
  const cameraRef = useRef(null);
  const [type, settype] = useState(Camera.Constants.Type.back);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setopen] = useState(false);
  const [hasSoundPermission, setHasSoundPermission] = useState();
  const [photo, setPhoto] = useState();
  const [serverRply, setServerRply] = useState();
  const [encodedImage, setEncodedImage] = useState();
  const [sound, setSound] = useState();
  const [statusSound, setStatusSound] = useState(false);
  const [soundParameters, setSoundParameters] = useState();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      const soundPermission = await Audio.requestPermissionsAsync();
      setHasCameraPermission(status === "granted");
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
      const { sound, apple } = await Audio.Sound.createAsync(
        {
          uri: "https://cc46-2400-1a00-b010-4d18-dc70-303b-742d-aede.in.ngrok.io/wav",
        },
        { shouldPlay: false },
        (apple) => setSoundParameters(apple)
      );
      setSound(sound);
    }

    let postJsonData = () => {
      console.log("Loading ...");
      alert("Loading please wait");
      fetch(
        "https://cc46-2400-1a00-b010-4d18-dc70-303b-742d-aede.in.ngrok.io/SendImage",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "Rohan",
            image: encodedImage,
          }),
        }
      )
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          <Text
            style={{
              marginLeft: 10,
            }}
          >
            {Math.floor(soundParameters.positionMillis / 1000 / 3600)}:
            {Math.floor(soundParameters.positionMillis / 1000 / 60)}:
            {Math.floor((soundParameters.positionMillis / 1000) % 60)}
          </Text>
          <Text
            style={{
              marginLeft: 285,
            }}
          >
            {Math.floor(soundParameters.durationMillis / 1000 / 3600)}:
            {Math.floor(soundParameters.durationMillis / 1000 / 60)}:
            {Math.floor((soundParameters.durationMillis / 1000) % 60)}
          </Text>
        </View>
        <Slider
          style={{ width: 400, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          minimumTrackTintColor="#0000FF"
          maximumTrackTintColor="#000000"
        />
        <TouchableOpacity
          style={styles.audioButton}
          onPress={statusSound === false ? playSound : pauseSound}
        >
          {statusSound === false ? (
            <FontAwesome name="play" size={35} color="#FFFF" />
          ) : (
            <FontAwesome name="pause" size={35} color="#FFFF" />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.audioButton}
          title="Back"
          onPress={goBack}
        >
          <FontAwesome name="arrow-left" size={35} color="#FFFF" />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Camera style={{ flex: 0.75 }} type={type} ref={cameraRef}>
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
  audioButton: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    margin: 20,
    borderRadius: 10,
    height: 50,
  },
});
