# API Documentation

## Overview
This backend provides RESTful API services for the Hospital Token Booking system. 

## Endpoints

### 1. **Authentication** (`/api/users/`)
- `POST /api/token/` - Obtain JWT access/refresh token pair.
- `POST /api/token/refresh/` - Refresh JWT access token.
- `POST /api/users/register/` - Register a new user (Patient or Admin).
- `GET /api/users/me/` - Get current authenticated user details.

### 2. **Doctors** (`/api/doctors/`)
- `GET /api/doctors/` - List all doctors.
- `POST /api/doctors/` - Add a new doctor (Admin only).
- `GET /api/doctors/{id}/` - Retrieve specific doctor details.

### 3. **Tokens & Queues** (`/api/tokens/`)
- `POST /api/tokens/book/` - Book a new token for a specific doctor.
- `GET /api/tokens/my-tokens/` - List tokens for the logged-in patient.
- `GET /api/queues/active/` - Get the current live queue status for a doctor.
- `PATCH /api/tokens/{id}/status/` - Update token status (e.g., Skip, Completed, Paused - Admin/Doctor only).

## Best Practices
- **Pagination**: All list endpoints return paginated responses.
- **Filtering**: Filters can be applied via query parameters.
- **Security**: JWT tokens must be included in the `Authorization: Bearer <token>` header for protected endpoints.
