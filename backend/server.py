from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Header, Query, UploadFile, File, Depends
from fastapi.responses import Response as FastAPIResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from bson import ObjectId
from typing import List, Optional
import os
import logging
import uuid
import jwt
import bcrypt
import requests
import secrets
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Constants
JWT_ALGORITHM = "HS256"
STORAGE_URL = "https://integrations.emergentagent.com/objstore/api/v1/storage"
APP_NAME = "admission-portal"
storage_key = None

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Utility Functions
def get_jwt_secret() -> str:
    return os.environ["JWT_SECRET"]

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = payload["sub"]
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Storage Functions
def init_storage():
    global storage_key
    if storage_key:
        return storage_key
    emergent_key = os.environ.get("EMERGENT_LLM_KEY")
    resp = requests.post(
        f"{STORAGE_URL}/init",
        json={"emergent_key": emergent_key},
        timeout=30
    )
    resp.raise_for_status()
    storage_key = resp.json()["storage_key"]
    return storage_key

def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    resp = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120
    )
    resp.raise_for_status()
    return resp.json()

def get_object(path: str) -> tuple:
    key = init_storage()
    resp = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60
    )
    resp.raise_for_status()
    return resp.content, resp.headers.get("Content-Type", "application/octet-stream")

# Models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str
    phone: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ApplicationCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    date_of_birth: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str
    high_school: str
    gpa: float
    graduation_year: int
    intended_major: str
    essay: str

class ApplicationUpdate(BaseModel):
    status: str

class UserResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    email: str
    name: str
    role: str
    phone: Optional[str] = None

class ApplicationResponse(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str
    user_id: str
    status: str
    first_name: str
    last_name: str
    email: str
    phone: str
    intended_major: str
    created_at: str
    updated_at: str

# Auth Endpoints
@api_router.post("/auth/register")
async def register(data: RegisterRequest, response: Response):
    email = data.email.lower()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed = hash_password(data.password)
    user_doc = {
        "email": email,
        "password_hash": hashed,
        "name": data.name,
        "phone": data.phone,
        "role": "student",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)
    
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "id": user_id,
        "email": email,
        "name": data.name,
        "role": "student",
        "phone": data.phone
    }

@api_router.post("/auth/login")
async def login(data: LoginRequest, request: Request, response: Response):
    email = data.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=900,
        path="/"
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=604800,
        path="/"
    )
    
    return {
        "id": user_id,
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "phone": user.get("phone")
    }

@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out successfully"}

@api_router.get("/auth/me")
async def get_me(request: Request):
    user = await get_current_user(request)
    return user

# Application Endpoints
@api_router.post("/applications")
async def create_application(data: ApplicationCreate, request: Request):
    user = await get_current_user(request)
    
    # Check if user already has an application
    existing = await db.applications.find_one({"user_id": user["id"]})
    if existing:
        raise HTTPException(status_code=400, detail="You already have an application")
    
    app_doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "status": "submitted",
        **data.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.applications.insert_one(app_doc)
    app_doc.pop("_id", None)
    return app_doc

@api_router.get("/applications/me")
async def get_my_application(request: Request):
    user = await get_current_user(request)
    application = await db.applications.find_one({"user_id": user["id"]}, {"_id": 0})
    if not application:
        return None
    return application

@api_router.get("/applications")
async def get_all_applications(request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    applications = await db.applications.find({}, {"_id": 0}).to_list(1000)
    return applications

@api_router.patch("/applications/{app_id}")
async def update_application_status(app_id: str, data: ApplicationUpdate, request: Request):
    user = await get_current_user(request)
    if user["role"] != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    
    result = await db.applications.update_one(
        {"id": app_id},
        {"$set": {"status": data.status, "updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    updated = await db.applications.find_one({"id": app_id}, {"_id": 0})
    return updated

# Document Upload Endpoints
@api_router.post("/documents/upload")
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Query(...),
    request: Request = None
):
    user = await get_current_user(request)
    
    # Check if user has an application
    application = await db.applications.find_one({"user_id": user["id"]})
    if not application:
        raise HTTPException(status_code=400, detail="Please submit an application first")
    
    ext = file.filename.split(".")[-1] if "." in file.filename else "bin"
    path = f"{APP_NAME}/documents/{user['id']}/{uuid.uuid4()}.{ext}"
    data = await file.read()
    
    result = put_object(path, data, file.content_type or "application/octet-stream")
    
    doc = {
        "id": str(uuid.uuid4()),
        "user_id": user["id"],
        "application_id": application["id"],
        "document_type": document_type,
        "storage_path": result["path"],
        "original_filename": file.filename,
        "content_type": file.content_type,
        "size": result["size"],
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.documents.insert_one(doc)
    doc.pop("_id", None)
    return doc

@api_router.get("/documents/me")
async def get_my_documents(request: Request):
    user = await get_current_user(request)
    documents = await db.documents.find(
        {"user_id": user["id"], "is_deleted": False},
        {"_id": 0}
    ).to_list(100)
    return documents

@api_router.get("/documents/{doc_id}/download")
async def download_document(
    doc_id: str,
    request: Request,
    authorization: str = Header(None),
    auth: str = Query(None)
):
    # Support both header and query param auth
    if not authorization and auth:
        request.scope["headers"].append((b"authorization", f"Bearer {auth}".encode()))
    
    user = await get_current_user(request)
    document = await db.documents.find_one({"id": doc_id, "is_deleted": False})
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Check access
    if user["role"] != "admin" and document["user_id"] != user["id"]:
        raise HTTPException(status_code=403, detail="Access denied")
    
    data, content_type = get_object(document["storage_path"])
    return FastAPIResponse(
        content=data,
        media_type=document.get("content_type", content_type),
        headers={
            "Content-Disposition": f'attachment; filename="{document["original_filename"]}"'
        }
    )

# Admin seed
async def seed_admin():
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@college.edu")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat()
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}}
        )
        logger.info("Admin password updated")
    
    # Write test credentials
    os.makedirs("/app/memory", exist_ok=True)
    with open("/app/memory/test_credentials.md", "w") as f:
        f.write("# Test Credentials\n\n")
        f.write("## Admin Account\n")
        f.write(f"Email: {admin_email}\n")
        f.write(f"Password: {admin_password}\n")
        f.write(f"Role: admin\n\n")
        f.write("## Test Student Account\n")
        f.write("Email: student@test.com\n")
        f.write("Password: student123\n")
        f.write("Role: student\n\n")
        f.write("## Endpoints\n")
        f.write("- POST /api/auth/register\n")
        f.write("- POST /api/auth/login\n")
        f.write("- GET /api/auth/me\n")
        f.write("- POST /api/applications\n")
        f.write("- GET /api/applications/me\n")

@app.on_event("startup")
async def startup():
    await seed_admin()
    try:
        init_storage()
        logger.info("Storage initialized")
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.applications.create_index("user_id")
    await db.applications.create_index("id", unique=True)
    await db.documents.create_index("user_id")
    await db.documents.create_index("id", unique=True)
    logger.info("Database indexes created")

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
