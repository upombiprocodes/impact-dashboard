import urllib.request
import json

try:
    with urllib.request.urlopen("http://localhost:8000/api/dashboard/summary") as response:
        print(f"Status Code: {response.getcode()}")
        data = json.loads(response.read().decode())
        print(f"Response: {data}")
except Exception as e:
    print(f"Error: {e}")
