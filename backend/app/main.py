from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.database import init_db
from app.api.v1.auth import router as auth_router
from app.api.v1.stations import router as stations_router
from app.api.v1.trains import router as trains_router
from app.api.v1.availability import router as avail_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.pnr import router as pnr_router
from app.api.v1.running import router as running_router
from app.api.v1.contact import router as contact_router
from app.api.v1.system import router as system_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables on application start
    await init_db()
    yield

app = FastAPI(
    title="RailVoya API",
    description="Backend API for RailVoya - Indian Train Travel Platform. Every journey, made simpler.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response

# Standardized Request Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_error = errors[0] if errors else {}
    msg = first_error.get("msg", "Invalid request parameters.")
    loc = " -> ".join([str(l) for l in first_error.get("loc", [])])
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": {
                "code": "VALIDATION_ERROR",
                "message": f"{loc}: {msg}",
                "details": errors
            }
        }
    )

# Include API v1 Routers
api_v1_prefix = "/api/v1"
app.include_router(system_router, prefix=api_v1_prefix)
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(stations_router, prefix=api_v1_prefix)
app.include_router(trains_router, prefix=api_v1_prefix)
app.include_router(avail_router, prefix=api_v1_prefix)
app.include_router(bookings_router, prefix=api_v1_prefix)
app.include_router(pnr_router, prefix=api_v1_prefix)
app.include_router(running_router, prefix=api_v1_prefix)
app.include_router(contact_router, prefix=api_v1_prefix)

@app.get("/")
async def root():
    return {
        "brand": settings.BRAND_NAME,
        "tagline": settings.TAGLINE,
        "domain": settings.INTENDED_DOMAIN,
        "status": "online",
        "docs": "/docs",
        "health": "/api/v1/system/health"
    }
