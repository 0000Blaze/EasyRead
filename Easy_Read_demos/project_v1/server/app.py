import io
import json
import base64
import logging
import numpy as np
from PIL import Image

import pytesseract
import cv2

from flask import Flask, request, abort, jsonify

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
    img_arr = np.asarray(img)      
    print('img shape', img_arr.shape)

    # process OCR with tesseract
    myconfig = r"--psm 6 --oem 3"
    text = pytesseract.image_to_string(img,config=myconfig)
    print(text)

    # process TTS

    
    return jsonify({'Response': 'Success'})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)