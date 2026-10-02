from fastapi import FastAPI, APIRouter, Header, HTTPException, BackgroundTasks, Request
import time
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import secrets
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, BeforeValidator
from typing import List, Optional, Annotated
from datetime import datetime, timezone

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

client = AsyncIOMotorClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]
ADMIN_KEY = os.environ['ADMIN_KEY']

from email_service import notify_owner  # noqa: E402

_RATE = {}


def rate_limited(ip: str, limit: int = 5, window: int = 600) -> bool:
    now = time.time()
    hits = [t for t in _RATE.get(ip, []) if now - t < window]
    _RATE[ip] = hits + [now]
    return len(hits) >= limit

app = FastAPI()
api_router = APIRouter(prefix="/api")

PyObjectId = Annotated[str, BeforeValidator(lambda v: str(v) if isinstance(v, ObjectId) else v)]


class BaseDocument(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    id: Optional[PyObjectId] = Field(default=None, alias="_id")

    @classmethod
    def from_mongo(cls, doc):
        return cls.model_validate(doc)

    def to_mongo(self):
        data = self.model_dump(by_alias=True, exclude={"id"})
        return data


class ContactIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    message: str = Field(min_length=1, max_length=5000)


class ContactMessage(BaseDocument):
    name: str
    email: str
    message: str
    created_at: str


@api_router.get("/")
async def root():
    return {"message": "ok"}


@api_router.post("/contact", response_model=ContactMessage, response_model_by_alias=False)
async def create_contact(payload: ContactIn, request: Request, background: BackgroundTasks):
    ip = request.headers.get("x-forwarded-for", request.client.host if request.client else "?").split(",")[0].strip()
    if rate_limited(ip):
        raise HTTPException(status_code=429, detail="Too many messages, try again later")
    msg = ContactMessage(
        name=payload.name.strip(),
        email=payload.email,
        message=payload.message.strip(),
        created_at=datetime.now(timezone.utc).isoformat(),
    )
    res = await db.contact_messages.insert_one(msg.to_mongo())
    msg.id = str(res.inserted_id)
    background.add_task(notify_owner, msg.name, msg.email, msg.message)
    return msg


def check_admin(key: Optional[str]):
    if not key or not secrets.compare_digest(key, ADMIN_KEY):
        raise HTTPException(status_code=401, detail="Invalid admin key")


@api_router.get("/contact", response_model=List[ContactMessage], response_model_by_alias=False)
async def list_contacts(x_admin_key: Optional[str] = Header(default=None)):
    check_admin(x_admin_key)
    docs = await db.contact_messages.find().sort("created_at", -1).to_list(1000)
    return [ContactMessage.from_mongo(d) for d in docs]


@api_router.delete("/contact/{msg_id}")
async def delete_contact(msg_id: str, x_admin_key: Optional[str] = Header(default=None)):
    check_admin(x_admin_key)
    if not ObjectId.is_valid(msg_id):
        raise HTTPException(status_code=404, detail="Not found")
    res = await db.contact_messages.delete_one({"_id": ObjectId(msg_id)})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Not found")
    return {"deleted": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
