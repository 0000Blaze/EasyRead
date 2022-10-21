from flask import Flask, request, abort, jsonify

app = Flask(__name__)

@app.route('/SendImage', methods=['POST'])

def returner():
    # if not request.json :
    #     abort(400)
    print(request.json)

    return jsonify({'Response': 'hello'})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)