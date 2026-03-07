import requests
import json

BASE_URL = "http://localhost:8000/api"

def test_agent_routing():
    # 1. Register a user
    reg_data = {
        "email": "test_new_user@example.com", 
        "password": "Password123!",
        "name": "Test User",
        "phone": "1234567890",
        "blood_group": "B+"
    }
    requests.post(f"{BASE_URL}/auth/register", json=reg_data)

    # 2. Login to get token
    login_data = {"email": "test_new_user@example.com", "password": "Password123!"}
    r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if r.status_code != 200:
        print(f"Login failed: {r.text}")
        return
    token = r.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Test Symptom Agent
    print("\n--- Testing Symptom Agent ---")
    chat_data = {"message": "I have been feeling dizzy and have a mild fever."}
    r = requests.post(f"{BASE_URL}/chat/route", json=chat_data, headers=headers)
    print(json.dumps(r.json(), indent=2))

    # 3. Test Emergency Routing
    print("\n--- Testing Emergency Routing ---")
    chat_data = {"message": "I have severe chest pain and trouble breathing!"}
    r = requests.post(f"{BASE_URL}/chat/route", json=chat_data, headers=headers)
    print(json.dumps(r.json(), indent=2))

    # 4. Test Report Agent
    print("\n--- Testing Report Agent ---")
    chat_data = {"message": "My hemoglobin is 10.2."}
    r = requests.post(f"{BASE_URL}/chat/route", json=chat_data, headers=headers)
    print(json.dumps(r.json(), indent=2))

    # 5. Test Prescription Agent
    print("\n--- Testing Prescription Agent ---")
    chat_data = {"message": "When is my Metformin refill due?"}
    r = requests.post(f"{BASE_URL}/chat/route", json=chat_data, headers=headers)
    print(json.dumps(r.json(), indent=2))

    # 6. Test Wellness Agent
    print("\n--- Testing Wellness Agent ---")
    chat_data = {"message": "What is my cardiovascular risk?"}
    r = requests.post(f"{BASE_URL}/chat/route", json=chat_data, headers=headers)
    print(json.dumps(r.json(), indent=2))

if __name__ == "__main__":
    test_agent_routing()
