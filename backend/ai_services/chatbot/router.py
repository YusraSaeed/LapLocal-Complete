# ai_services/chatbot/router.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from fastapi.responses import JSONResponse
from .chatbot import bot
import logging

router = APIRouter()

class QueryInput(BaseModel):
    question: str
    user_id: str
    stream: bool = False

@router.post("/ask")
async def handle_question(input: QueryInput):
    try:
        response = bot(input.question, input.user_id)
        return JSONResponse(content={"response": response})
    except Exception as e:
        logging.error(f"[chatbot] ❌ Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
