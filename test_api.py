import requests

response = requests.post(
    "http://127.0.0.1:5000/predict-mood",
    json = {
        "text": "I feel horrible today."
    }
)

print(response.json())