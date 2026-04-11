from fastapi import APIRouter
from pydantic import BaseModel
from users import create_user, authenticate
from jwt_auth import create_token

router = APIRouter()

class UserIn(BaseModel):
    username: str
    password: str

@router.post("/signup")
def signup(user: UserIn):
    create_user(user.username, user.password)
    return {"status": "user created"}

@router.post("/login")
def login(user: UserIn):
    if not authenticate(user.username, user.password):
        return {"error": "invalid credentials"}

    token = create_token(user.username)
    return {"token": token}
