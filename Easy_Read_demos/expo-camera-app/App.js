import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Button,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import { Audio } from "expo-av";
import { Buffer } from "buffer";

export default function App() {
  let cameraRef = useRef();
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [hasSoundPermission, setHasSoundPermission] = useState();
  const [photo, setPhoto] = useState();
  const [serverRply, setServerRply] = useState();
  const [encodedImage, setEncodedImage] = useState();

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      const mediaLibraryPermission =
        await MediaLibrary.requestPermissionsAsync();
      const soundPermission = await Audio.requestPermissionsAsync();
      setHasCameraPermission(cameraPermission.status === "granted");
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

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
    setEncodedImage(newPhoto["base64"]);
    // console.log(encodedImage);
  };

  if (photo) {
    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      });
    };

    let postJsonData = () => {
      fetch("https://1909-27-34-16-239.in.ngrok.io/SendImage", {
        // fetch("https://boredapi.com/api/activity", {
        //server ip
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          something: "hi",
          // something_else: "hey",
          image: encodedImage,
        }),
      })
        .then((response) => response.json())
        .then((responseJson) => {
          // console.log(responseJson);
          // console.log(encodedImage);
          setEncodedImage(undefined);
          setServerRply(responseJson);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => setPhoto(undefined));
    };

    return (
      <SafeAreaView style={styles.container}>
        <Image
          style={styles.preview}
          source={{ uri: "data:image/jpg;base64," + photo.base64 }}
        />
        <Button title="Send" onPress={postJsonData} />
        {hasMediaLibraryPermission ? (
          <Button title="Save" onPress={savePhoto} />
        ) : undefined}
        <Button title="Discard" onPress={() => setPhoto(undefined)} />
      </SafeAreaView>
    );
  }

  if (serverRply) {
    let goBack = () => {
      setServerRply(undefined);
    };

    async function soundPlay() {
      console.log("sound button");
      const { sound: playbackObject } = await Audio.Sound.createAsync(
        { uri: "https://1909-27-34-16-239.in.ngrok.io/wav" },
        { shouldPlay: true }
      );
    }

    return (
      <View style={styles.container}>
        <Text styles={{ margine: 10, fontSize: 16 }}>
          hello fetch request succesful
        </Text>
        <Button title="Speak" onPress={soundPlay} />
        <Button title="Back" onPress={goBack} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camContainer} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <Button title="Take pic" onPress={takePic} />
        </View>
        <StatusBar style="auto" />
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alighItems: "center",
    justifyContent: "center",
  },
  camContainer: {
    flex: 0.75,
    backgroundColor: "#fff",
    alighItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    backgroundColor: "#fff",
    alignSelf: "flex-end",
  },
  preview: {
    // alignSelf: "stretch",
    flex: 1,
  },
});
