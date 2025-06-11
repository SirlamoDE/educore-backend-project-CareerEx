# Auth Module

This folder contains all authentication and authorization logic for the EduCore backend system.

## Responsibilities

- User registration with role assignment (`student`, `instructor`)
- Email verification using tokens
- Secure login and JWT token issuance
- Password reset via email token
- Password change for logged-in users
- Middleware for route protection and role-based access

## Files

- `auth.controller.js`: Handles all incoming HTTP requests related to auth
- `auth.routes.js`: Defines auth-related API endpoints
- `auth.service.js`: Business logic for authentication
- `auth.utils.js`: Helper functions (e.g., token generation, email formatting)
