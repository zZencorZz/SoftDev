from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware

from src.routers import *
from src.core.exceptions import MainException

app = FastAPI(title="API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(MainException)
async def main_exception_handler(request: Request, exc: MainException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "message": exc.message,
            "error": exc.__class__.__name__
        }
    )

app.include_router(router=auth_router, prefix="/api")
app.include_router(router=users_router, prefix="/api")
app.include_router(router=projects_router, prefix="/api")
app.include_router(router=languages_router, prefix="/api")
app.include_router(router=platforms_router, prefix="/api")
app.include_router(router=reviews_router, prefix="/api")
app.include_router(router=architectures_router, prefix="/api")
app.include_router(router=software_types_router, prefix="/api")