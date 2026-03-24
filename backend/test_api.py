import requests

# Login to get JWT
res = requests.post("https://hospital-token-booking-system-p03y.onrender.com/api/auth/login/", json={"username": "admin", "password": "admin"})
if res.status_code != 200:
    print("Login Failed:", res.status_code, res.text)
    exit(1)

access_token = res.json().get("access")
headers = {"Authorization": f"Bearer {access_token}"}

# List tokens
tokens_res = requests.get("https://hospital-token-booking-system-p03y.onrender.com/api/tokens/")
print("Tokens:", tokens_res.json())

# Assuming token ID 3 exists based on previous shell test
patch_res = requests.patch("https://hospital-token-booking-system-p03y.onrender.com/api/tokens/3/", json={"status": "COMPLETED"}, headers=headers)
print("Patch Token 3:", patch_res.status_code, patch_res.text)

# Check queue status mappings
queue_res = requests.get("https://hospital-token-booking-system-p03y.onrender.com/api/queue-status/")
print("Queue Status:", queue_res.status_code, queue_res.text)
