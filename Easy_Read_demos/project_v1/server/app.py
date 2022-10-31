import io
import base64
import logging
# import numpy as np
from PIL import Image

import pytesseract

from flask import Flask, request, abort, jsonify
# from flask_ngrok import run_with_ngrok

app = Flask(__name__)
app.logger.setLevel(logging.DEBUG)

@app.route('/SendImage', methods=['POST'])

def returner():
    # print(request.json)

    if not request.json or 'image' not in request.json: 
        abort(400)
    # get the base64 encoded string
    im_b64 = request.json['image']
    # convert it into bytes  
    img_bytes = base64.b64decode(im_b64.encode('utf-8'))
    # convert bytes data to PIL Image object
    img = Image.open(io.BytesIO(img_bytes))
    # PIL image object to numpy array
    # img_arr = np.asarray(img)      
    # print('img shape', img_arr.shape)

    # process OCR with tesseract
    myconfig = r"--psm 6 --oem 3"
    text = pytesseract.image_to_string(img,config=myconfig)
    # print(text)

    # process TTS
    
    #dummy audio return
    audioFilepath = "response.wav"
    with open(audioFilepath,'rb') as f:
        audio_encoded = base64.b64encode(f.read())
    
    data ={
        "content": str(audio_encoded),
        "sampleRate" : 8000,
        "encoding":"FLAC",
        "languageCode":"en-US",
    }

    print("Successful")
    return jsonify(data)
    # return jsonify({'Response': text})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
