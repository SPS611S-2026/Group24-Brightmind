# SQLite Migration Guide - From Supabase to SQLite

## Overview
This guide walks you through migrating the SPS (Student Psychological Support) application from Supabase (PostgreSQL) to SQLite for easier local development and testing.

## Benefits of SQLite
✅ **Zero Configuration** - No external database setup needed
✅ **File-based** - Database is stored locally as a single file
✅ **Perfect for Development** - Complete testing without cloud dependencies
✅ **Built-in Prisma Support** - Seamless ORM integration
✅ **Data Persistence** - All data saved locally in `prisma/dev.db`

## Setup Instructions

### 1. Update Environment Variables
The `.env` file has been updated to use SQLite:

```bash
DATABASE_URL="file:./prisma/dev.db"
PORT=4000
```

### 2. Regenerate Prisma Client
```bash
cd backend
npm run prisma:generate
```

### 3. Create Database and Apply Migrations
Run the database reset to create a fresh SQLite database with the new schema:

```bash
npx prisma migrate reset
```

**⚠️ This will:**
- Delete the existing SQLite database (if any)
- Create a new `prisma/dev.db` file
- Apply all migrations
- Run the seed script, which now leaves the database empty

### 4. Start the Backend Server
```bash
npm run dev
```

You should see:
```
✅ Backend server running on http://localhost:4000
```

## Data Flow Architecture

### Frontend → Backend
1. Student/Counselor makes requests via React components
2. Frontend sends HTTP requests to backend API
3. Backend receives requests at `http://localhost:4000/api/...`

### Backend → Database
1. Backend processes API request
2. Prisma ORM translates to SQLite queries
3. Data is stored in `prisma/dev.db`
4. Response is sent back to frontend

## API Endpoints

### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

### Availability
- `GET /api/availability` - Get all availability slots
- `GET /api/availability/:counsellor_id` - Get by counsellor
- `POST /api/availability` - Create availability
- `PUT /api/availability/:id` - Update availability
- `DELETE /api/availability/:id` - Delete availability

### Mood Logs
- `GET /api/mood_logs` - Get all mood logs
- `POST /api/mood_logs` - Create mood log
- `GET /api/mood_logs/:student_id` - Get student's logs

### Session Notes
- `GET /api/session_notes` - Get all notes
- `POST /api/session_notes` - Create session note
- `GET /api/session_notes/:appointment_id` - Get by appointment

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user
- `GET /api/auth/profile` - Get user profile

## Complete Data Flow Example: Student Books an Appointment

### Step 1: Student Selects Counsellor
Frontend fetches availability:
```
GET /api/availability → SQLite → Returns all available slots
```

### Step 2: Student Books Appointment
Frontend creates appointment:
```
POST /api/appointments
Body: {
  student_id: "224016393",
  counsellor_id: "C-001",
  date: "2024-04-20",
  startTime: "10:00",
  reason: "Stress management"
}
↓
SQLite ← Prisma ← Backend
↓
Response: Created appointment with ID
```

### Step 3: Calendar Updates
Frontend fetches appointments again and displays:
- ✅ Green slot for counsellor's availability
- 🔵 Blue slot for student's booking

### Step 4: Counsellor Sees the Booking
When counsellor logs in:
```
GET /api/appointments → SQLite → Filtered by counsellor_id
↓
Calendar shows new student booking
```

### Step 5: Counsellor Flags Urgent Issue
If counsellor notices urgent issue:
```
PUT /api/appointments/:id
Body: {
  urgent: true,
  flagged_by: "C-001"
}
↓
SQLite updates record
↓
Student dashboard shows urgent flag
```

## Testing the System

### Test 1: Create Availability (Counsellor)
```bash
curl -X POST http://localhost:4000/api/availability \
  -H "Content-Type: application/json" \
  -d '{
    "counsellor_id": "C-001",
    "date": "2024-04-20",
    "startTime": "10:00",
    "endTime": "10:30"
  }'
```

### Test 2: View Availability (Student)
```bash
curl http://localhost:4000/api/availability
```

### Test 3: Create Appointment (Student)
```bash
curl -X POST http://localhost:4000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "student_id": "224016393",
    "counsellor_id": "C-001",
    "date": "2024-04-20",
    "startTime": "10:00",
    "endTime": "10:30",
    "reason": "Stress management"
  }'
```

### Test 4: View Appointments
```bash
curl http://localhost:4000/api/appointments
```

## Troubleshooting

### Issue: Database file not created
**Solution:** Make sure `prisma/` directory exists and you have write permissions
```bash
mkdir -p backend/prisma
```

### Issue: Prisma migration fails
**Solution:** Reset the database
```bash
npx prisma migrate reset --force
```

### Issue: Port 4000 already in use
**Solution:** Change PORT in .env or kill the process using the port

### Issue: Data not persisting
**Solution:** Ensure `DATABASE_URL` points to correct SQLite file path

## File Structure

```
backend/
├── prisma/
│   ├── schema.prisma       ← Database schema (SQLite)
│   ├── dev.db             ← SQLite database file (auto-created)
│   └── migrations/        ← Migration history
├── controllers/           ← API logic (updated for SQLite)
├── routes/               ← API endpoints
├── services/
│   └── prismaClient.js   ← Prisma ORM client
├── server.js             ← Express server
├── package.json
└── .env                  ← Environment config (SQLite URL)
```

## Database Schema

### Users
- id, name, email, faculty, role, created_at

### Appointments
- id, student_id, counsellor_id, date, time, status, urgent, created_at

### Availability
- id, counsellor_id, date, startTime, endTime, created_at

### MoodLogs
- id, student_id, date, mood, sleep, appetite, energy, stress, created_at

### SessionNotes
- id, appointment_id, counsellor_id, date, notes, created_at

### Resources
- id, title, description, type, url, created_at

## Next Steps

1. ✅ Start backend: `npm run dev`
2. ✅ Start frontend: `npm run dev` (in frontend folder)
3. ✅ Register your own student, counsellor, or admin account
4. ✅ Add availability, appointments, and resources through the app
5. ✅ Verify data appears in calendar and dashboards
6. ✅ Test urgent flag functionality

## Important Notes

- **SQLite is single-file** - Easy to backup and share
- **Local performance** - Faster than cloud database for development
- **No internet required** - Perfect for offline work
- **Perfect for testing** - All data flows end-to-end locally
- **Easy reset** - Delete `prisma/dev.db` to start fresh

## Support

If you encounter issues:
1. Check `.env` file has correct `DATABASE_URL`
2. Verify `prisma/` directory exists
3. Check backend server is running on port 4000
4. View server logs for error messages
5. Reset database with `npx prisma migrate reset`
