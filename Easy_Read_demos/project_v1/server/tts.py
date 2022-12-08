import gtts
# import playsound


def textToSpeech(sentence):
	tts = gtts.gTTS(str(sentence))
	tts.save("response.wav")

# textToSpeech('''Hi this is response from server. text to speech library has been used''')
