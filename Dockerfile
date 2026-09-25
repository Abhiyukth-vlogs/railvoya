# Multi-stage Dockerfile for RailVoya (Full Stack)
# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend & Production Server
FROM python:3.12-slim AS runner
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv for fast Python packaging
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy backend requirements and install
COPY backend/pyproject.toml ./backend/
WORKDIR /app/backend
RUN uv venv /opt/venv && uv pip install -e . --no-cache

# Copy backend source
COPY backend/ ./

# Copy built frontend assets to static mount directory
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

ENV PATH="/opt/venv/bin:$PATH"
ENV ENVIRONMENT="production"
ENV PORT=8000
ENV HOST="0.0.0.0"

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
