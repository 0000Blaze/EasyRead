import React, {useState, useEffect} from 'react';
import {SafeAreaView, StatusBar, Text, View} from 'react-native';
import TextRecognition from 'react-native-text-recognition';
import {launchImageLibrary} from 'react-native-image-picker';

const App = () => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState(null);

  useEffect(() => {
    launchImageLibrary([], setImage);
  }, []);

  useEffect(() => {
    (async () => {
      if (image) {
        const result = await TextRecognition.recognize(image.assets[0].uri);
        setText(result);
      }
    })();
  }, [image]);

  return (
    <SafeAreaView>
      <StatusBar>
        <View>
          <Text>Text recongnition</Text>
          {text ? <Text>{text}</Text> : null}
        </View>
      </StatusBar>
    </SafeAreaView>
  );
};

export default App;

// pics orientation prop in RNcamera
