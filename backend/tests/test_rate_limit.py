"""Rate limit test for /api/contact (5 per IP per 10 min). Uses distinct X-Forwarded-For to isolate IP bucket."""
import os
import uuid
import requests
import pytest

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dev-showcase-1891.preview.emergentagent.com').rstrip('/')
ADMIN_KEY = "cRxxCoEOzZG3q89TH9WthAoQ"


def test_rate_limit_429_on_sixth():
    fake_ip = f"203.0.113.{(uuid.uuid4().int % 200) + 10}"
    created = []
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "X-Forwarded-For": fake_ip})
    try:
        for i in range(5):
            r = s.post(f"{BASE_URL}/api/contact", json={
                "name": f"TEST_RL_{i}",
                "email": f"test_rl_{i}@example.com",
                "message": f"TEST rate-limit {i}",
            })
            assert r.status_code == 200, f"Expected 200 on request {i}, got {r.status_code}: {r.text}"
            created.append(r.json()["id"])
        # 6th request should be rate-limited
        r6 = s.post(f"{BASE_URL}/api/contact", json={
            "name": "TEST_RL_6",
            "email": "test_rl_6@example.com",
            "message": "TEST should 429",
        })
        assert r6.status_code == 429, f"Expected 429, got {r6.status_code}: {r6.text}"
    finally:
        # cleanup
        for cid in created:
            requests.delete(f"{BASE_URL}/api/contact/{cid}", headers={"X-Admin-Key": ADMIN_KEY})
