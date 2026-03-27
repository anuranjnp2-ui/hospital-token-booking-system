# Setup & Installation Guide

This project is organized into structured modules: `frontend`, `backend`, `database`, `config`, and `scripts`.

## Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- PostgreSQL or Supabase account
- Git

## 1. Environment Configuration
Copy the environment example and configure it.
```bash
cp config/env.example .env
```
Ensure you update database credentials and API keys in `.env`.

## 2. Backend Setup
The backend uses Django configured as an API service.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt
```
Apply migrations:
```bash
python manage.py migrate
```

## 3. Frontend Setup
The frontend uses React and Vite.
```bash
cd frontend
npm install
```

## 4. Running the Project locally
You can use the helper script from the root:
```bash
bash scripts/start.sh
```
Or manually run each service in separate terminals:
- **Backend:** `cd backend && python manage.py runserver`
- **Frontend:** `cd frontend && npm run dev`
