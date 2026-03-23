# Frontend Integration Guide - Gentle Queue

This document outlines how the React frontend can consume the newly built Django APIs.

## API Base URL
In development, your Django server will run on `http://127.0.0.1:8000/`.

## Authentication Flow (JWT)

1. **Register User**  
   `POST /api/auth/register/`  
   **Payload:**  
   ```json
   {
       "username": "patient123",
       "password": "securepassword",
       "email": "patient@example.com",
       "first_name": "John",
       "last_name": "Doe",
       "phone_number": "+1234567890",
       "is_patient": true
   }
   ```

2. **Login (Get Token)**  
   `POST /api/auth/login/`  
   **Payload:**  
   ```json
   {
       "username": "patient123",
       "password": "securepassword"
   }
   ```  
   **Response:**  
   ```json
   {
       "access": "eyJhb...",
       "refresh": "eyJhb..."
   }
   ```  
   *Save this `access` token in `localStorage` or memory.*

## Protected Endpoints
Send the `access` token in your API headers:
```javascript
const response = await fetch('http://127.0.0.1:8000/api/tokens/', {
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    }
});
```

## Token Booking Logic

1. **List Available Doctors**  
   `GET /api/doctors/`  
   *(No authentication required)*

2. **Book a Token**  
   `POST /api/tokens/book/`  
   **Requires Authentication**  
   **Payload:**  
   ```json
   {
       "doctor": 1
   }
   ```  
   **Response:** returns the booked token object with your queue number (`token_number`).

3. **Get Current Token (Live Queue)**  
   `GET /api/tokens/current/?doctor=1`  
   *(No authentication required)*  
   **Returns:** Information about the currently serving token for the specified doctor.

4. **My Tokens (Patient Dashboard)**  
   `GET /api/tokens/`  
   **Requires Authentication**  
   **Returns:** List of tokens booked by the currently logged-in user.

## Queue Status Dashboard (Admin/Reception)
- `GET /api/queue-status/`  
  Lists all overall queue statuses per doctor dynamically.
