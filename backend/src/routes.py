#!/usr/bin/python3
"""Routes module for portfolio management."""
import base64
import hashlib
import json
from random import randbytes
from pydantic import EmailStr
import requests as req
from requests import Request as Req, Session as ReqSession
from requests.exceptions import ConnectionError, Timeout, TooManyRedirects
from datetime import datetime
from typing import List
from fastapi import (
    APIRouter, HTTPException, Request,
    status, Depends, Response
)
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.exc import IntegrityError, DataError
from sqlalchemy.orm import Session
from src.db_config import get_db
from src.notifications import Email
from src.utils import verify_pwd, hash_pwd
from src.models import User, Token
from src.schemas import (
    ForgotPassword, ResetPassword, UserRes, CreateUser, UpdateUser,
    TokenRes, CreateToken, UpdateToken, Login
)
from src.oauth import (
    create_token, get_current_user,
    basic_auth, BasicAuth
)
from src.settings import settings, TEMPLATES

portf_routers = APIRouter(prefix="/portfolio/v1", tags=['portfolio'])

# Coinmarketcap APIs endpoint
CMC_API_URL = 'https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest'
HEADERS = {
  'Accepts': 'application/json',
  'X-CMC_PRO_API_KEY': settings.X_CMC_PRO_API_KEY, # APIs Secret Key
}

# Coinranking APIs
COINRANK_HEADERS = {
    "Accepts": "application/json",
    "x-access-token": settings.COINRANK_API_KEY
}
COINRANK_URL = "https://api.coinranking.com/v2/coins"


@portf_routers.get("/users", response_model=List[UserRes])
async def retrieve_users(
    session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Retrieve users from the database."""
    users = session.query(User).all()
    if not users:
        return {"message": "No users found"}
    if current_user.username == "tester":
        return users
    raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )


@portf_routers.get("/users/{user_id}", response_model=UserRes)
async def retrieve_user(
    user_id: str, session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Retrieve a user from the database."""
    try:
        user = session.query(User).filter(User.id == user_id).one_or_none()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.id == current_user.id:
            return user
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    except DataError as error:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid user's id"
        ) from error


@portf_routers.put("/users/{user_id}/update")
async def update_user(
    user_data: UpdateUser, user_id: str,
    session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Update user's data in database."""
    try:
        user = session.query(User).filter(User.id == user_id)
        if not user.one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.one_or_none() == current_user.id:
            try:
                if user_data.email == None:
                    user_data.email = user.one_or_none().email
                elif user_data.username == None:
                    user_data.username = user.one_or_none().username
                user.one_or_none().updated_at = datetime.utcnow()
                user.update(user_data.dict(), synchronize_session=False)
                session.commit()
                return {"message": "Account updated successfully"}
            except IntegrityError as error:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail="User with email or username already exists"
                ) from error
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    except DataError as error1:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid user's id"
        ) from error1


@portf_routers.delete(
    "/users/{user_id}/delete",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_user(
    user_id: str, session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Delete user's data in database."""
    try:
        user = session.query(User).filter(User.id == user_id)
        if not user.one_or_none():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.one_or_none().id == current_user.id:
            user.delete()
            session.commit()
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    except DataError as error:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid user's id"
        )


@portf_routers.post(
    "/users/create",
    status_code=status.HTTP_201_CREATED
)
async def create_user(
    user_data: CreateUser,
    session: Session = Depends(get_db)
):
    """Add new user data in the database."""
    try:
        user_data.password = hash_pwd(user_data.password)
        new_user = User(**user_data.dict())
        session.add(new_user)
        session.commit()
        session.refresh(new_user)
        return {"message": "success"}
    except IntegrityError as error:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="User with username or email already exists"
        ) from error


# [---------------- LOGIN --------------------]


@portf_routers.get('/verifyemail/{token}')
def verify_me(
    token: str,
    session: Session = Depends(get_db)
):
    """Verify a user."""
    hashed_code = hashlib.sha256()
    hashed_code.update(bytes.fromhex(token))
    verification_code = hashed_code.hexdigest()
    verified = {
        "updated_at": datetime.utcnow(),
        "is_active": True
    }
    get_user = session.query(User).filter(
                                User.verification_code == verification_code
                                )
    get_user.update(verified, synchronize_session=False)
    session.commit()

    if not get_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User does not exist')
    return {
        "status": "success",
        "message": "Account verified successfully"
    }


@portf_routers.post("/login_token")
def login_token(
    response: Response,
    credentials: OAuth2PasswordRequestForm = Depends(),
    session: Session = Depends(get_db)
):
    """User authentication method."""
    print(credentials)
    q_username = session.query(User).filter(
        User.username == credentials.username
    ).first()

    if not q_username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    if not verify_pwd(credentials.password, q_username.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    if q_username and verify_pwd(credentials.password, q_username.password):
        response.status_code = status.HTTP_200_OK
        access_token = create_token(
            data={
                "id": q_username.id,
                "username": q_username.username
            }
        )
        return {"access_token": access_token, "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        detail="Invalid data type"
    )


@portf_routers.post("/login")
async def login_basic(
    response: Response,
    auth: Login,
    # auth: BasicAuth = Depends(basic_auth),
    session: Session = Depends(get_db)
):
    """Login basic authentication."""
    # if not auth:
    #     response = Response(
    #         headers={"WWW-Authenticate": "Basic"},
    #         status_code=status.HTTP_401_UNAUTHORIZED
    #     )
    #     return response

    try:
        # decoded = base64.b64decode(auth).decode("ascii")
        # username, _, password = decoded.partition(":")
        user = session.query(User).filter(
            User.username == auth.username
        ).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect email or password"
            )

        if user and verify_pwd(auth.password, user.password):
            access_token = create_token(
                data={
                    "id": user.id,
                    "username": user.username
                }
            )

            # token = jsonable_encoder(access_token)

            # response.status_code = status.HTTP_200_OK
            # response.set_cookie(
            #     "Authorization",
            #     value=f"Bearer {token}",
            #     domain="http://0.0.0.0:8000",
            #     httponly=True,
            #     max_age=settings.ACCESS_TOKEN_EXPIRY_WEEKS,
            #     expires=settings.ACCESS_TOKEN_EXPIRY_WEEKS,
            # )
            return {"token": access_token, "token_type": "bearer", "username": user.username}

    except HTTPException:
        response = Response(
            headers={"WWW-Authenticate": "Basic"},
            status_code=status.HTTP_401_UNAUTHORIZED
        )
        return response


@portf_routers.get("/forgotten/password", response_model=ForgotPassword)
async def forgotten_password(
    email: EmailStr, request: Request,
    response: Response,
    session: Session = Depends(get_db)
):
    """Forgotten password."""
    user = session.query(User).filter(User.email == email).one_or_none()
    if user:
        try:
            url = f"""
            {
                request.url.scheme
            }://{request.client.host}:{
                request.url.port
                }/portfolio/v1/confirm_reset/password/{user.id}
            """
            await Email(
                user.dict(), url, [EmailStr(user.email)]
            ).forgotten_password()
            response.status_code = status.HTTP_200_OK
            return {
                "message": "Check your email to reset your password."
            }
        except Exception as error:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail='There was an error sending email'
            ) from error
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="User with {email} not found"
    )


@portf_routers.get("/confirm_reset/password/{user_id}")
async def confirm_reset(
    user_id: str, request: Request,
    session: Session = Depends(get_db)
):
    """Confirm a user's reset password request."""
    get_user = session.query(User).filter(
                                User.id == user_id
                                ).one_or_none()
    if not get_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='User does not exist')
    return TEMPLATES.TemplateResponse(
        "confirm_reset_password.html",
        {"request": request, "user_id": user_id}
    )


@portf_routers.put("/reset/password")
async def reset_password(
    passwd: ResetPassword, request: Request,
    session: Session = Depends(get_db)
):
    """Reset password."""
    user = session.query(User).filter(User.id == passwd.user_id)
    if user.one_or_none():
        update_password = hash_pwd(passwd.password)
        user.update(password=update_password, synchronize_session=False)
        session.commit()
        return TEMPLATES.TemplateResponse(
            "reset_password_success.html",
            {"request": request}
        )
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have the right to reset password"
    )


@portf_routers.post("/logout")
async def route_logout_and_remove_cookie():
    """Logout the user."""
    response = RedirectResponse(url="/portfolio/v1/login")
    # response.delete_cookie("Authorization", domain="http://0.0.0.0:8000")
    return response.status_code


# [---------------- TOKEN --------------------]


@portf_routers.get("/tokens")
async def retrieve_tokens(
    session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
) -> List[dict]:
    """Retrieve user's tokens from the database."""
    try:
        user_tokens = session.query(Token).select_from(User).join(
            User.tokens
        ).filter(User.id == current_user.id).all()
        if not user_tokens:
            return []

        sess = ReqSession()
        sess.headers.update(COINRANK_HEADERS)
        tokens = []

        try:
            for token in user_tokens:
                parameters = {
                    "search": f"{token.symbol.upper()}"
                }
                # parameters = {
                #     'symbol': f"{token.symbol.upper()}",
                #     'skip_invalid': True
                # }
                response = sess.get(COINRANK_URL, params=parameters)
                data = response.json()["data"]["coins"]
                tokens.append({"data": data[0], "token": token})
                # data = json.loads(response.text)['data']
                # name = data[token.symbol][0]["name"]
                # num_market_pairs = data[token.symbol][0]["num_market_pairs"]
                # max_supply = data[token.symbol][0]["max_supply"]
                # circulating_supply = data[token.symbol][0]["circulating_supply"]
                # total_supply = data[token.symbol][0]["total_supply"]
                # quote = data[token.symbol][0]["quote"]
                # tokens.append(
                #     {
                #         "token_id": token.id,
                #         "token": token,
                #         "name": name,
                #         "num_market_pairs": num_market_pairs,
                #         "max_supply": max_supply,
                #         "circulating_supply": circulating_supply,
                #         "total_supply": total_supply,
                #         "quote": quote
                #     }
                # )
            return tokens
        except (ConnectionError, Timeout, TooManyRedirects) as e:
            raise HTTPException(
                status_code=status.HTTP_408_REQUEST_TIMEOUT,
                detail="Connection error"
            ) from e
    except DataError as error:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid user's id"
        ) from error


@portf_routers.get("/tokens/{token_id}")
async def retrieve_token(
    token_id: int, session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Retrieve user's token from the database."""
    try:
        token = session.query(Token).filter(Token.id == token_id).one_or_none()
        if not token:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token not found"
            )
        if token.user_id == current_user.id:
            sess = ReqSession()
            sess.headers.update(COINRANK_HEADERS)
            # parameters = {
            #     'symbol': f"{token.symbol.upper()}",
            #     'skip_invalid': True
            # }
            parameters = {
                "search": f"{token.symbol.upper()}"
            }
            try:
                response = sess.get(COINRANK_URL, params=parameters)
                coin_detail = response.json()["data"]["coins"][0]
                # data = json.loads(response.text)['data']
                # name = data[token.symbol][0]["name"]
                # num_market_pairs = data[token.symbol][0]["num_market_pairs"]
                # max_supply = data[token.symbol][0]["max_supply"]
                # circulating_supply = data[token.symbol][0]["circulating_supply"]
                # total_supply = data[token.symbol][0]["total_supply"]
                # quote = data[token.symbol][0]["quote"]
                # return {
                #     "token": token,
                #     "name": name,
                #     "num_market_pairs": num_market_pairs,
                #     "max_supply": max_supply,
                #     "circulating_supply": circulating_supply,
                #     "total_supply": total_supply,
                #     "quote": quote
                # }
                return {
                    "token": token,
                    "coin_detail": coin_detail
                }
            except (ConnectionError, Timeout, TooManyRedirects) as e:
                raise HTTPException(
                    status_code=status.HTTP_408_REQUEST_TIMEOUT,
                    detail="Connection error"
                )
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    except DataError as error:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid token id"
        ) from error


@portf_routers.get("/tokens/{token_uuid}/history/{c_time}")
async def get_history(
    token_uuid: str,
    c_time: str,
    current_user: str = Depends(get_current_user),
    session: Session = Depends(get_db)
):
    """Retrieve a token's history."""
    coin = session.query(Token).filter(
        Token.coinrank_coin_uuid == token_uuid
    ).first()
    if coin:
        sess = ReqSession()
        sess.headers.update(COINRANK_HEADERS)
        c_uuid = coin.coinrank_coin_uuid
        COINRANK_HISTORY_URL = f"https://api.coinranking.com/v2/coin/{c_uuid}/history?timePeriod={c_time}"
        try:
            response = sess.get(COINRANK_HISTORY_URL)
            return response.json()
        except (ConnectionError, Timeout, TooManyRedirects) as e:
            raise HTTPException(
                status_code=status.HTTP_408_REQUEST_TIMEOUT,
                detail="Connection error"
            )
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Token not found"
    )


@portf_routers.put(
    "/tokens/{token_id}/update"
)
async def update_token(
    token_data: UpdateToken, token_id: int,
    session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Update user's token data in the database."""
    try:
        token = session.query(Token).filter(Token.id == token_id)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Token not found"
            )
        if token.one_or_none().user_id == current_user.id:
            try:
                token.one_or_none().updated_at = datetime.utcnow()
                token.update(token_data.dict(), synchronize_session=False)
                session.commit()
                return {"message": "Token updated successfully"}
            except IntegrityError as error:
                raise HTTPException(
                    status_code=status.HTTP_304_NOT_MODIFIED,
                    detail="Error occurred while updating your token"
                ) from error
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    except DataError as error1:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid code id"
        ) from error1


@portf_routers.delete(
    "/tokens/{token_id}/delete",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_token(
    token_id: int, session: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Delete user's token data in the database."""
    try:
        token = session.query(Token).filter(Token.id == token_id)
        if not token.one_or_none():
            raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found"
            )
        if token.one_or_none() and token.one_or_none().user_id == current_user.id:
            token.delete()
            session.commit()
            return
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Permission denied"
        )
    except DataError as error:
        raise HTTPException(
            status_code=status.HTTP_406_NOT_ACCEPTABLE,
            detail="Invalid token id"
        ) from error


@portf_routers.post(
    "/tokens/create",
    status_code=status.HTTP_201_CREATED
)
async def create_crypto_token(
    token_data: CreateToken,
    session: Session = Depends(get_db),
    cureent_user: str = Depends(get_current_user)
):
    """Add token data in the database."""
    try:
        sess = ReqSession()
        sess.headers.update(COINRANK_HEADERS)
        parameters = {
            "search": f"{token_data.symbol.upper()}"
        }
        response = sess.get(COINRANK_URL, params=parameters)
        coin_detail = response.json()["data"]["coins"][0]
        coin_rank_coin_uuid = coin_detail["uuid"]
        token_data.coinrank_coin_uuid = coin_rank_coin_uuid
        new_token = Token(**token_data.dict(), user_id=cureent_user.id)
        session.add(new_token)
        session.commit()
        session.refresh(new_token)
        return new_token
    except IntegrityError as error:
        print(error)
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Error occurred while creating your token"
        ) from error


# [------------------------COIN NEWS & MARKET VALUES------------------------------]


@portf_routers.get("/top-change")
async def get_market_change():
    """Retrieve market change."""
    COINRANK_API_URL_ORDER = "https://api.coinranking.com/v2/coins"
    parameters = {
                    'limit': "10",
                    'orderBy': 'change'
                }
    market_change = req.get(
        COINRANK_API_URL_ORDER,
        headers=COINRANK_HEADERS,
        params=parameters
    )
    return market_change.json()


@portf_routers.get("/market")
async def get_top_10():
    """Top 10 coins."""
    COINRANK_API_URL = "https://api.coinranking.com/v2/coins"
    parameters = {
                    'limit': "10"
                }
    top_10_coins = req.get(
        COINRANK_API_URL,
        headers=COINRANK_HEADERS,
        params=parameters
    )
    return top_10_coins.json()


@portf_routers.get("/news")
async def get_news():
    """Retrieve crypto news."""
    NEWSFEED_URL = "https://newsdata.io/api/1/news"
    NEWSFEED_HEADERS = {
        "Accepts": "application/json"
    }
    parameters = {
                    "apikey": "pub_24028323c95ac5b7c3225c9fe78b5b34a60a1",
                    'q': "cryptocurrency"
                }
    news = req.get(
        NEWSFEED_URL, 
        headers=NEWSFEED_HEADERS,
        params=parameters)
    top_ten = news.json()['results']
    return top_ten
