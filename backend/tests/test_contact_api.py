"""Backend tests for Contact API"""
import os
import pytest
import requests

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://dev-showcase-1891.preview.emergentagent.com').rstrip('/')
ADMIN_KEY = "cRxxCoEOzZG3q89TH9WthAoQ"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def created_ids():
    return []


def test_root(session):
    r = session.get(f"{BASE_URL}/api/")
    assert r.status_code == 200
    assert r.json().get("message") == "ok"


def test_create_contact_success(session, created_ids):
    payload = {"name": "TEST_User1", "email": "test_user1@example.com", "message": "Hello from test"}
    r = session.post(f"{BASE_URL}/api/contact", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["name"] == "TEST_User1"
    assert data["email"] == "test_user1@example.com"
    assert data["message"] == "Hello from test"
    assert "id" in data and data["id"]
    created_ids.append(data["id"])


def test_create_contact_invalid_email(session):
    r = session.post(f"{BASE_URL}/api/contact", json={"name": "TEST_X", "email": "not-an-email", "message": "hey"})
    assert r.status_code == 422


def test_create_contact_empty_fields(session):
    r = session.post(f"{BASE_URL}/api/contact", json={"name": "", "email": "a@b.com", "message": ""})
    assert r.status_code == 422


def test_list_contacts_requires_key(session):
    r = session.get(f"{BASE_URL}/api/contact")
    assert r.status_code == 401


def test_list_contacts_wrong_key(session):
    r = session.get(f"{BASE_URL}/api/contact", headers={"X-Admin-Key": "wrong"})
    assert r.status_code == 401


def test_list_contacts_ok(session, created_ids):
    r = session.get(f"{BASE_URL}/api/contact", headers={"X-Admin-Key": ADMIN_KEY})
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert any(m["id"] in created_ids for m in data)


def test_delete_contact_requires_key(session, created_ids):
    if not created_ids:
        pytest.skip("no id")
    r = session.delete(f"{BASE_URL}/api/contact/{created_ids[0]}")
    assert r.status_code == 401


def test_delete_contact_invalid_id(session):
    r = session.delete(f"{BASE_URL}/api/contact/not-an-id", headers={"X-Admin-Key": ADMIN_KEY})
    assert r.status_code == 404


def test_resume_pdf_served(session):
    r = session.get(f"{BASE_URL}/assets/resume.pdf")
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("application/pdf") or r.content[:4] == b"%PDF"


def test_cleanup_delete_created(session, created_ids):
    for cid in created_ids:
        r = session.delete(f"{BASE_URL}/api/contact/{cid}", headers={"X-Admin-Key": ADMIN_KEY})
        assert r.status_code == 200
        assert r.json().get("deleted") is True
    # Verify deletion by listing
    r = session.get(f"{BASE_URL}/api/contact", headers={"X-Admin-Key": ADMIN_KEY})
    assert r.status_code == 200
    ids = {m["id"] for m in r.json()}
    for cid in created_ids:
        assert cid not in ids
