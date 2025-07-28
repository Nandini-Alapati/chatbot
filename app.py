from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from chat import get_response  # Ensure chat.py defines get_response

# 👇 Tell Flask where to find templates and static files
app = Flask(
    __name__,
    template_folder='frontend/templates',
    static_folder='frontend/static'
)

CORS(app)  # Enable CORS for communication between frontend and backend

@app.route("/")
def index_get():
    print("Trying to serve base.html...")  # Debug print
    return render_template("base.html")

@app.route("/predict", methods=["POST"])
def predict():
    user_input = request.get_json().get("message")
    response = get_response(user_input)
    return jsonify({"answer": response})

if __name__ == "__main__":
    app.run(debug=True)