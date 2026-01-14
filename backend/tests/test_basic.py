def test_app_runs(client):
    res = client.get("/")
    assert res.status_code in (200, 404)
