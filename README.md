# Gentle Queue - Hospital Token Booking System

A full-stack, production-ready hospital token booking system, built with React, Vite, Django, and PostgreSQL/Supabase.

## Project Structure

```
gentle-queue-main/
├── frontend/     # React + Vite application (UI, components, pages)
├── backend/      # Django API backend (models, views, services, serializers)
├── database/     # Database migrations and seed data
├── config/       # Environment configs and Docker setups
├── docs/         # API, Setup, and Arch documentation
├── scripts/      # Automation scripts (start.sh, deploy.sh)
└── README.md
```

## Getting Started
Please read the [Setup Guide](docs/SETUP.md) located in `docs/SETUP.md`.

## Key Architectural Decisions
- **API-First Design**: The Django backend is structured as a robust API service, centralizing routing, models, and business logic into domains instead of distributed mini-apps.
- **Frontend Isolation**: The React frontend is completely decoupled from the backend. 
- **DevOps Ready**: Docker and environmental variables are isolated in `config/`.
