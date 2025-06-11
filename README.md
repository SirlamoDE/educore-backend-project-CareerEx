# EduCore Server

EduCore Server is a Node.js/Express backend API for user authentication and management, designed for educational platforms. It supports user registration with email verification, login, password reset, and role-based access (student, instructor, admin).

---

## Features

- User registration with email verification
- Secure login with JWT authentication
- Password reset via email
- Role-based user model (student, instructor, admin)
- Input validation with Joi and express-validator
- MongoDB (Mongoose) for data storage

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/sirlamode/educore-server.git
cd educore-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory with the following content:

```env
PORT=6500
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=2h

EMAIL_HOST=smtp.yourprovider.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email@example.com
EMAIL_PASSWORD=your_email_password_or_app_password
EMAIL_FROM=EduCore <your_email@example.com>
```

> **Note:** For Gmail, use `smtp.gmail.com` and an App Password if 2FA is enabled.

---

## Running the App

```bash
npm start
```

The server will run on `http://localhost:6500` by default.

---

## API Endpoints

### **Auth Routes**

| Method | Endpoint                          | Description                        |
|--------|-----------------------------------|------------------------------------|
| POST   | `/api/auth/register`              | Register a new user                |
| GET    | `/api/auth/verify-email/:token`   | Verify user email                  |
| POST   | `/api/auth/login`                 | Login with email and password      |
| POST   | `/api/auth/forgot-password`       | Request password reset email       |
| POST   | `/api/auth/reset-password/:token` | Reset password with token          |

---

## Example Requests

### Register

```json
POST /api/auth/register
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "StrongPassw0rd!",
  "firstName": "John",
  "lastName": "Doe",
  "state": "Lagos"
}
```

### Login

```json
POST /api/auth/login
{
  "email": "john@example.com",
  "password": "StrongPassw0rd!"
}
```

### Forgot Password

```json
POST /api/auth/forgot-password
{
  "email": "john@example.com"
}
```

### Reset Password

```json
POST /api/auth/reset-password/:token
{
  "password": "NewStrongPassw0rd!",
  "confirmPassword": "NewStrongPassw0rd!"
}
```text

---

## Project Structure

```text
src/
  api/
    controllers/      # Route handlers
    models/           # Mongoose schemas
    routes/           # Express routes
    services/         # Business logic
  config/             # DB and environment config
  utils/              # Utility functions (mailer, etc.)
  validators/         # Joi and express-validator schemas
```

```text

# Project Url

 [EduCore Production API](https://educore-backend-project-careerex-production.up.railway.app)


 [API DOCUMENTATION (Postman)](https://documenter.getpostman.com/view/33459968/2sB2x5Ht8K)

```
