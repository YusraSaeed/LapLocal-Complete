# from fastapi import FastAPI
# from recommender.router import router as recommender_router

# from fastapi.middleware.cors import CORSMiddleware

# app = FastAPI()

# # Explicitly allow only required origins
# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
#     "http://192.168.32.1:5173",
#     "http://localhost:5174"
# ]

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,  # NOT ["*"] if you're using credentials
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Mount routes
# app.include_router(recommender_router, prefix="/recommender", tags=["Recommender"])

# @app.get("/")
# def root():
#     return {"message": "LapLocal AI Services running"}

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from recommender.router import router as recommender_router
from chatbot.router import router as chatbot_router   # 👈 Add this

app = FastAPI(title="LapLocal AI Services")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommender_router, prefix="/recommender", tags=["Recommender"])
app.include_router(chatbot_router, prefix="/chatbot", tags=["Chatbot"])  # 👈 Mount here

@app.get("/")
def root():
    return {"message": "LapLocal AI services running."}
