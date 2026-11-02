import requests

response = requests.post(
    "http://127.0.0.1:5000/predict-mood",
    json = {
        "text": "i don't feel like doing anything"
    }
)

print(response.json())