from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, _engine
from .routers import auth, books

app = FastAPI()

Base.metadata.create_all(bind=_engine)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get("/")
def health_check():
    return "Health check complete!"


app.include_router(auth.router)
app.include_router(books.router)
