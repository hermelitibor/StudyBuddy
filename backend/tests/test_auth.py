def test_register_success(client):
    payload = {
        "email": "test@elte.hu",
        "password": "password123",
        "name": "Teszt Elek",
        "major": "Informatika",
        "hobbies": ["sport", "programozás"]
    }

    response = client.post("/register", json=payload)

    assert response.status_code == 201

    data = response.get_json()
    assert "token" in data
    assert data["user"]["email"] == "test@elte.hu"

def test_register_invalid_email(client):
    payload = {
        "email": "test@gmail.com",
        "password": "password123",
        "major": "Informatika"
    }

    response = client.post("/register", json=payload)

    assert response.status_code == 400

def test_login_success(client):
    # előbb regisztrálunk
    client.post("/register", json={
        "email": "login@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    response = client.post("/login", json={
        "email": "login@elte.hu",
        "password": "password123"
    })

    assert response.status_code == 200
    assert "token" in response.get_json()

def test_login_wrong_password(client):
    client.post("/register", json={
        "email": "bad@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })

    res = client.post("/login", json={
        "email": "bad@elte.hu",
        "password": "WRONG"
    })

    assert res.status_code == 401

def test_profile_requires_token(client):
    res = client.get("/profile")
    assert res.status_code == 401


def test_profile_success(client):
    reg = client.post("/register", json={
        "email": "me@elte.hu",
        "password": "password123",
        "major": "Informatika"
    })
    token = reg.get_json()["token"]

    res = client.get(
        "/profile",
        headers={"Authorization": f"Bearer {token}"}
    )

    assert res.status_code == 200
    assert res.get_json()["email"] == "me@elte.hu"
    
def test_groups_search_requires_auth(client):
    res = client.get("/groups/search?q=analízis")
    assert res.status_code == 401
    
