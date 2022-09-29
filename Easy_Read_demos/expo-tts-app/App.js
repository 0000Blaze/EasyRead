import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, TextInput } from "react-native";
import * as Speech from "expo-speech";
import React from "react";

export default function App() {
  const [thingToSay, setSpeachWord] = React.useState("");
  const audio_output = `${thingToSay}`;

  const options = {
    pitch: 1.5,
    rate: 0.7,
  };

  const speakThings = () => {
    Speech.speak(audio_output, options);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setSpeachWord}
        value={thingToSay}
      />
      <Button title="Speak" onPress={speakThings} />
      <StatusBar style="auto" />
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
  input: {
    alignSelf: "stretch",
    height: 50,
    borderBottomWidth: 2,
    borderBottomColor: "red",
    margin: 20,
  },
});
