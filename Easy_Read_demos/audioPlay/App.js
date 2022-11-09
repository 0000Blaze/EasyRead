import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import { Audio } from "expo-av";
// import { Constants } from "expo";
import { useState, useEffect } from "react";
// import * as Sharing from "expo-sharing";

const source = {
  uri: "https://a8a4-27-34-16-89.in.ngrok.io/wav",
};

export default function App() {
  const [sound, setSound] = useState();
  const [status, setStatus] = useState(false);

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(source);
    setSound(sound);

    console.log("Playing Sound");
    await sound.playAsync();
    setStatus(true);
  }

  let testPause = () => {
    console.log("Pause Sound");
    sound.pauseAsync();
    sound.unloadAsync();
    setStatus(false);
  };

  return (
    <View style={styles.container}>
      <Button
        title={status === false ? "Play" : "Pause"}
        onPress={status === false ? playSound : testPause}
      />
      {/* <Button title="Stop" onPress={testStop} /> */}
      {/* <Button title="Pause" onPress={testPause} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: 256,
    height: 256 / 1.618,
    margin: 5,
    borderRadius: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    backgroundColor: "transparent",
  },
});
