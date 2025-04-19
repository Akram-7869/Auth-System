# 🔐 Auth System - User Management Application

A modern full-stack authentication and user management app with role-based access control, built using **React**, **Node.js**, and **PostgreSQL**.

---

## 🌍 Overview

This application provides:
- Secure user authentication
- Role-based access control
- Password recovery (Forgot/Reset Password)
- Admin dashboard for user management

Roles supported:
- **STAFF**
- **SUPERVISOR**
- **ADMIN**

---

## 🎓 Tech Stack

### Backend
- **Node.js** + **Express.js** - Web server & routing
- **PostgreSQL** - Database
- **Prisma** - Database ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Request validation
- **Swagger UI** - API documentation
- **dotenv** - Environment configuration
- **cors** - Cross-origin access

### Frontend
- **React 19** - Frontend library
- **Redux Toolkit** - State management
- **React Router DOM 7** - Navigation
- **Tailwind CSS 4** - Styling
- **React Toastify** - Toast notifications

> ⚠️ **Note:**
> - Swagger `/api-docs` is ready to use with bearer token already pre-configured.
> - Admin credentials (default):  
>   **Email**: `admin@example.com`  
>   **Password**: `admin123`
> - Avien DB might fail occasionally due to unstable connection string (not a code issue).

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd auth-system
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file:

```env
DATABASE_URL="your-database-connection-string"
JWT_SECRET="your-jwt-secret-key"
JWT_EXPIRES_IN=1d
PORT=3000
```

#### Set up the Database
```bash
npx prisma migrate dev --name init
npx prisma generate
```

#### Run the Server
```bash
node server.js
```

Your API server is now live at: `http://localhost:3000`

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

Frontend is served at: `http://localhost:5173`

---

## 🌐 App Structure

### Backend Routes

| Endpoint                        | Description                        |
| ------------------------------ | ---------------------------------- |
| `/api/auth/register`          | Register a new user                |
| `/api/auth/login`             | Login user                         |
| `/api/auth/me`                | Get current user profile           |
| `/api/users/all`              | Get all users (Admin only)         |
| `/api/auth/forgot-password`   | Generate reset link (email input) |
| `/api/auth/reset-password/:token` | Reset password with token     |


### Data Model: User
- `id`
- `name`
- `email`
- `password`
- `role`

### Auth
- JWT stored in `localStorage`
- Passwords hashed with bcrypt
- Auth & Role middleware on protected routes

---

### Frontend Pages

| Route              | Component        | Access              |
| ------------------| ---------------- | ------------------- |
| `/login`          | Login Page       | Public              |
| `/signup`         | Register Page    | Public              |
| `/dashboard`      | Dashboard        | Authenticated users |
| `/users`          | User List        | Admin only          |
| `/forgot-password`| Forgot Password  | Public              |
| `/reset-password` | Reset Password   | From email link     |


### Redux Slices
- `authSlice` - Stores user/token/resetLink
- `loadingSlice` - Manages loading spinner state

---

## 🥇 User Roles & Access

| Role        | Features                               |
| ----------- | -------------------------------------- |
| **STAFF**     | Access to personal dashboard          |
| **SUPERVISOR**| Extended access beyond staff          |
| **ADMIN**     | Full control, user management, etc.  |

---

## 🔄 Usage Flow

1. **Signup**
   - `/signup`
   - Fill form: name, email, password, role

2. **Login**
   - `/login`
   - Authenticates and redirects by role

3. **Dashboard**
   - View profile details
   - Admin sees all users

4. **Password Recovery**
   - `/forgot-password` to generate reset link
   - `/reset-password/:token` to update password

---

## 📃 API Docs

Visit Swagger UI: `http://localhost:3000/api-docs`
- Try out API endpoints
- Pre-configured with Bearer token support

---

## 🔒 Security Features

- Passwords hashed with bcrypt
- JWT for authentication
- Role-based authorization
- Input validation
- Protected routes on both frontend & backend

---

## 🚫 Troubleshooting

- **CORS error?**
  - Check backend `cors` config to match frontend origin

- **DB issues?**
  - Ensure `DATABASE_URL` in `.env` is correct

- **Token issues?**
  - JWTs expire in 24h. Check `JWT_EXPIRES_IN` value.

---

## 💼 License

Licensed under the **MIT License**.

---

Made with ❤️ using React + Node + PostgreSQL

