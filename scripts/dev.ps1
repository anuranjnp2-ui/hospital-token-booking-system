# Gentle Queue - Development Startup Script
# Run this from the root directory to start both backend and frontend

Write-Host "Starting Gentle Queue Backend (Django)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\venv\Scripts\activate; python manage.py runserver 8000"

Write-Host "Starting Gentle Queue Frontend (Vite)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nProject is running!" -ForegroundColor Yellow
Write-Host "Backend API: http://localhost:8000/api/"
Write-Host "Frontend UI:  http://localhost:8080/"
