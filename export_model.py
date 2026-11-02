
import json
import joblib
import os

print("Loading trained model...")

model = joblib.load("sentiment_model.pkl")
vectorizer = joblib.load("tfidf_vectorizer.pkl")

exported_model = {
    "classes": model.classes_.tolist(),
    "coefficients": model.coef_.tolist(),
    "intercepts": model.intercept_.tolist(),

    "vocabulary": {
        word: int(index)
        for word, index in vectorizer.vocabulary_.items()
    },

    "idf": vectorizer.idf_.tolist()
}

print("Preparing JSON...")

json_text = json.dumps(
    exported_model,
    ensure_ascii=False,
    separators=(",", ":")
)

# Validate JSON before saving
json.loads(json_text)

temp_file = "sentiment_model_temp.json"

with open(temp_file, "w", encoding="utf-8") as file:
    file.write(json_text)

# Verify saved JSON
with open(temp_file, "r", encoding="utf-8") as file:
    json.load(file)

os.replace(temp_file, "sentiment_model.json")

file_size = os.path.getsize("sentiment_model.json")

print("\nExport successful!")
print("Vocabulary size:", len(vectorizer.vocabulary_))
print("File size:", file_size, "bytes")
print("JSON validation: PASSED")
