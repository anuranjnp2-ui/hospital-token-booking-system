# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Backend Runtime
FROM python:3.10-slim
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy backend requirements and install
COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ ./backend/

# Copy built frontend assets to backend static folder
# This assumes WhiteNoise is configured to serve static files
COPY --from=frontend-builder /app/frontend/dist ./backend/staticfiles/

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=10000

# Start command
WORKDIR /app/backend
CMD sh -c "python manage.py migrate --noinput && python manage.py shell -c 'import seeds; seeds.create_seeds()' && gunicorn core.wsgi:application --bind 0.0.0.0:${PORT:-10000}"
