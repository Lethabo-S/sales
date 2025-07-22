# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from models.chatbot import generate_response

# app = Flask(__name__)
# CORS(app)

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_query = request.json.get('query')
#     response = generate_response(user_query)
#     return jsonify({ 'response': response })
# from flask import Flask, request, jsonify
# from models.chatbot import generate_response

# app = Flask(__name__)

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_query = request.json.get('query')  # Get query from frontend
#     if not user_query:
#         return jsonify({'error': 'No query provided'}), 400

#     try:
#         bot_response = generate_response(user_query)
#         return jsonify({'response': bot_response})  # 👈 This line
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True)

# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from models.chatbot import generate_response

# app = Flask(__name__)

# # Allow only your frontend origin explicitly
# CORS(app, resources={r"/chat": {"origins": "http://localhost:5173"}})

# @app.route('/chat', methods=['POST'])
# def chat():
#     user_query = request.json.get('query')
#     if not user_query:
#         return jsonify({'error': 'No query provided'}), 400

#     try:
#         response = generate_response(user_query)
#         return jsonify({'response': response})
#     except Exception as e:
#         return jsonify({'error': str(e)}), 500

# if __name__ == '__main__':
#     app.run(debug=True, port=5000)

from flask import Flask, request, jsonify
from flask_cors import CORS
from models.chatbot import generate_response

app = Flask(__name__)

# CORS configuration for local dev
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

@app.route('/chat', methods=['POST'])
def chat():
    user_query = request.json.get('query')
    if not user_query:
        return jsonify({'error': 'No query provided'}), 400

    try:
        response = generate_response(user_query)
        return jsonify({'response': response})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)

