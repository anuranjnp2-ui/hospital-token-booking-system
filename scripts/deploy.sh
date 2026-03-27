#!/bin/bash
# deploy.sh - Production deployment script
echo "Deploying system..."

# 1. Pull latest code
git pull origin main

# 2. Build Frontend
echo "Building Production Frontend..."
cd frontend
npm ci
npm run build
cd ..

# 3. Backend tasks
echo "Running Migrations & Collecting Static..."
cd backend
source venv/bin/activate
pip install -r ../requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
echo "Restarting backend services (e.g., Gunicorn/Uvicorn)..."
sudo systemctl restart gunicorn

echo "Deployment finished!"
