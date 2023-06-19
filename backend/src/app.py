#!/usr/bin/python3
"""Portfolio entry point module."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.db_config import engine
from src.models import Base
from src.routes import portf_routers

Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def index():
    """Entry point."""
    return {"message": "Welcome back"}


app.include_router(portf_routers)
