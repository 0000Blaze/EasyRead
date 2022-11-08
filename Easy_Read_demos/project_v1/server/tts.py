import gtts
import playsound


def textToSpeech(sentence):
	tts = gtts.gTTS(str(sentence))
	tts.save("hello.wav")

textToSpeech("Khana khayou.")
