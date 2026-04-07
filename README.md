# Library Management System

Backend service for managing users, authentication, books, loans, password reset by email, and user avatars.

## Stack

- Node.js + Express
- TypeScript
- Prisma + SQLite
- JWT auth
- Zod validation
- Nodemailer (SMTP)
- Multer + Sharp (avatar upload and resize)

## Features

- Authentication: register, login, refresh, logout
- Password reset flow:
  - request reset token by email
  - reset password with token
- Users:
  - current user profile
  - admin-only list/details
  - upload avatar
  - delete avatar
- Books:
  - public read endpoints
  - admin create/update/delete
- Loans:
  - create loan
  - return loan
  - list loans (scope depends on role)

## Project Structure

```text
src/
	app.ts
	server.ts
	config.ts
	controllers/
	db/
	middleware/
	routes/
	schemas/
	services/
	utils/
uploads/
	avatars/
prisma/
	schema.prisma
```

## Requirements

- Node.js 18+
- npm

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Create local env file

```bash
cp .env.example .env
```

3. Fill required values in `.env`

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `PORT`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_AUTH_USER`
- `SMTP_AUTH_PASS`
- `SENDER_EMAIL`

4. Sync database

```bash
npx prisma db push
npx prisma generate
```

5. Start development server

```bash
npm run dev
```

Health check:

```bash
curl http://localhost:3000/health
```

## Scripts

- `npm run dev` - run in watch mode with nodemon
- `npm run build` - compile TypeScript
- `npm run start` - run compiled build
- `npm run watch` - TypeScript watch mode
- `npm run format` - format project with Prettier
- `npm run db:push` - push Prisma schema to DB
- `npm run db:generate` - regenerate Prisma client
- `npm run db:migrate` - run Prisma migration flow

## API Overview

Base URL: `http://localhost:3000`

Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/request-password-reset`
- `POST /auth/reset-password`

Users

- `GET /users/me`
- `POST /users/me/avatar` (multipart field: `avatar`)
- `DELETE /users/me/avatar`
- `GET /users` (admin)
- `GET /users/:id` (admin)

Books

- `GET /books`
- `GET /books/:id`
- `POST /books` (admin)
- `PUT /books/:id` (admin)
- `DELETE /books/:id` (admin)

Loans

- `GET /loans`
- `POST /loans`
- `POST /loans/:id/return`

Also available under `/api/*` aliases.

## Avatar Behavior

- Accepted types: JPEG, PNG
- Max size: 5 MB
- Files are resized to 256x256 via Sharp
- Old avatar file is deleted on replacement
- Static serving path: `/uploads/avatars/...`
