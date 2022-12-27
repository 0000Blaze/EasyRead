import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import Slider from "@react-native-community/slider";
import React, { useEffect, useRef, useState } from "react";
import { FontAwesome } from "expo-vector-icons";
import { Audio } from "expo-av";

export const AudioCard = ({ url, setFetchResponse, setOpenModal }) => {
  const [seekTime, setSeekTime] = useState(0);
  const [duraMillis, setDuraMills] = useState(0);
  const [isRequesting, setIsRequesting] = useState(false);
  const audio = useRef(null);
  const [audioIcon, setAudioIcon] = useState("play");

  async function playAudio(audiouri = `${url}/mpeg`) {
    if (audio.current !== null) {
      if (audioIcon === "pause") {
        setAudioIcon("play");
        await audio.current.pauseAsync();
      } else {
        await audio.current.playAsync();
        setAudioIcon("pause");
      }
    } else {
      try {
        setIsRequesting(true);
        const { sound } = await Audio.Sound.createAsync({
          uri: audiouri,
        });
        audio.current = sound;
        audio.current.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setAudioIcon("play");
            audio.current.replayAsync();
            audio.current.pauseAsync();
          }
          setDuraMills(status.durationMillis);
          setSeekTime(status.positionMillis / status.durationMillis);
        });
        await audio.current.playAsync();
        setAudioIcon("pause");
        setIsRequesting(false);
      } catch (error) {
        console.log(error);
      }
    }
  }

  let goBack = () => {
    if (audio.current) audio.current.unloadAsync();
    audio.current = null;
    setFetchResponse(false);
    setOpenModal(false);
  };

  useEffect(() => {
    return audio.current
      ? () => {
          audio.current.unloadAsync();
          audio.current = null;
        }
      : undefined;
  }, [audio.current]);

  return (
    <View style={styles.container}>
      <Text
        style={{
          marginLeft: 10,
        }}
      >
        Seeking may seem lagging due to slow internet connection
      </Text>
      <Text></Text>
      <Text
        style={{
          marginLeft: 10,
        }}
      >
        {Math.floor((seekTime * duraMillis) / 1000 / 3600)}:
        {Math.floor((seekTime * duraMillis) / 1000 / 60)}:
        {Math.floor((seekTime * duraMillis) / 1000) % 60}/
        {Math.floor(duraMillis / 1000 / 3600)}:
        {Math.floor(duraMillis / 1000 / 60)}:
        {Math.floor(duraMillis / 1000) % 60}
      </Text>
      <Slider
        style={styles.slider}
        minimumValue={audio.current ? 0 : 0}
        maximumValue={audio.current ? 1 : 0}
        value={seekTime}
        onValueChange={async (value) => {
          if (!audio.current) return;
          const status = await audio.current?.getStatusAsync();
          await audio.current?.setPositionAsync(value * status.durationMillis);
        }}
        onSlidingStart={async () => {
          if (!audio.current) return;
          await audio.current.pauseAsync();
          setAudioIcon("play");
        }}
        onSlidingComplete={async () => {
          if (!audio.current) return;
          await audio.current.playAsync();
          setAudioIcon("pause");
        }}
        minimumTrackTintColor="orange"
        maximumTrackTintColor="#000000"
      />
      <TouchableOpacity
        style={styles.audioButton}
        title="play_pause"
        onPress={() => playAudio()}
      >
        {isRequesting ? (
          <FontAwesome name="spinner" size={35} color="#FFFF" />
        ) : (
          <FontAwesome name={audioIcon} size={35} color="#FFFF" />
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
  slider: {
    width: "100%",
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

export default AudioCard;
