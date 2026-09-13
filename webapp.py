from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib

app = Flask(__name__)
CORS(app)

model = joblib.load("sentiment_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

@app.route("/predict-mood", methods=["POST"])
def predict_mood():

    data = request.get_json()
    text = data.get("text", "")

    if not text.strip():
        return jsonify({
            "error": "No text provided."
        }), 400

    text_vectorized = vectorizer.transform([text])
    prediction = model.predict(text_vectorized)[0]
    probabilities = model.predict_proba(text_vectorized)[0]
    confidence = max(probabilities)

    return jsonify({
        "mood": prediction,
        "confidence": round(float(confidence), 4)
    })

if __name__ == "__main__":
    app.run(debug=True)