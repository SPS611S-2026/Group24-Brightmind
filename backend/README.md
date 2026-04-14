# Backend API for NUST Mental Health

This backend provides a REST API with **real data persistence using Supabase (PostgreSQL)**.

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- Supabase account (free at [supabase.com](https://supabase.com))

### Setup

1. **Follow the Supabase Setup Guide:**
   ```
   See: SUPABASE_SETUP.md
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate deploy
   ```

4. **Start the server:**
   ```bash
   npm start
   ```

Server runs on: `http://localhost:4000`

## 🗄️ Database Models

All data is persisted to Supabase PostgreSQL:

- **Profile** - User accounts with roles (student/counsellor/admin)
- **Availability** - Counselor available time slots
- **Appointment** - Bookings between students and counselors
- **MoodLog** - Student mood check-ins
- **Resource** - Mental health resources
- **SessionNote** - Counselor session notes

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password/role
- `GET /api/auth/profile` - Get current user profile

### Availability (Counselors)
- `GET /api/availability` - List all availability slots
- `POST /api/availability` - Create new slot
- `PUT /api/availability/:id` - Update slot
- `DELETE /api/availability/:id` - Delete slot

### Appointments (Students)
- `GET /api/appointments` - List all appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment

### Mood Logs
- `GET /api/mood_logs` - Get mood logs
- `POST /api/mood_logs` - Create mood log

### Resources
- `GET /api/resources` - Get mental health resources
- `POST /api/resources` - Add resource

### Session Notes
- `GET /api/session_notes` - Get notes
- `POST /api/session_notes` - Create note

### Profiles
- `GET /api/profiles` - Get all user profiles
- `GET /api/profiles/me` - Get current user profile
- `PUT /api/profiles/:id` - Update user profile

## 🔐 Authentication

All protected endpoints require Bearer token:

```
Authorization: Bearer token_xyz...
```

Tokens are returned from `/api/auth/login` endpoint.

## 🛠️ Development

### View Database
```bash
npx prisma studio
```

Opens web UI to browse/edit database tables directly.

### Create New Migration
```bash
npx prisma migrate dev --name description_of_changes
```

### Check Out Schema
Schema is in: `prisma/schema.prisma`

## 🚀 Deployment

For production deployment, ensure:
1. `.env` file is set on your server (not committed to git)
2. Database migrations are run: `npx prisma migrate deploy`
3. NODE_ENV=production
4. Proper error handling and logging

## 📚 More Resources

- [Prisma Docs](https://www.prisma.io/docs/)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
