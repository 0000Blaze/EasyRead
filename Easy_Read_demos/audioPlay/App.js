import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import { Audio } from "expo-av";
import * as Sharing from "expo-sharing";

export default function App() {
  async function componentDidMount() {
    Audio.setAudioModeAsync({
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
    });
  }

  async function playSound() {
    console.log("sound button");
    const { sound: playbackObject } = await Audio.Sound.createAsync(
      { uri: "https://1909-27-34-16-239.in.ngrok.io/wav" },
      { shouldPlay: true }
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Play Sound" color={"#3CBB"} onPress={() => playSound()} />
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
});
