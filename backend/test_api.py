import requests

district = input("Enter district name: ").strip()

response = requests.post(
    "http://127.0.0.1:5000/recommend",
    json={"district": district}
)

if response.status_code == 200:
    data = response.json()
    print("\n✅ Recommended Schemes for", data["district"])
    for scheme in data["schemes"]:
        print("👉", scheme)
else:
    print("❌", response.json()["error"])
