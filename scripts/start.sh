#!/bin/bash
# start.sh - Boot system in dev mode

echo "Starting Gentle Queue Backend API..."
cd backend
source venv/Scripts/activate || source venv/bin/activate
python manage.py runserver &
BACKEND_PID=$!

echo "Starting Gentle Queue Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
