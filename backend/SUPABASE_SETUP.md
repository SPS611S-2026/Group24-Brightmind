# Supabase Setup Instructions

This application now uses **Supabase (PostgreSQL)** for real data persistence instead of mock data.

## Quick Setup

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Project Name**: e.g., "NUST-Mental-Health"
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to you (e.g., Africa - Johannesburg)
4. Click "Create New Project" (takes ~2 minutes)

### 2. Get Your Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Look for **Connection String**
3. Copy the **PSQL** format string (looks like):
   ```
   postgresql://postgres:your_password@db.your_project_ref.supabase.co:5432/postgres?sslmode=require
   ```

### 3. Configure Environment Variables

1. In the `backend/` folder, create a `.env` file (copy from `.env.example`)
2. Paste your Supabase connection string:
   ```
   DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT_REF.supabase.co:5432/postgres?schema=public&sslmode=require
   PORT=4000
   ```
3. Replace:
   - `YOUR_PASSWORD` with your database password
   - `YOUR_PROJECT_REF` with your actual project reference

### 4. Create Database Tables (Migrations)

Run Prisma migrations to create the tables:

```bash
cd backend

# Install dependencies (if not done)
npm install

# Run migrations
npx prisma migrate deploy

# Optional: View database in Prisma Studio
npx prisma studio
```

### 5. Start the Backend

```bash
npm start
```

You should see:
```
Mock data storage initialized
Backend server running on http://localhost:4000
```

## Troubleshooting

### "Can't reach database server" Error

**Cause**: DATABASE_URL is wrong or missing
**Solution**: 
- Double-check your connection string from Supabase dashboard
- Make sure `.env` file exists and has the correct URL
- Verify you're using `?sslmode=require` at the end

### "Password authentication failed"

**Cause**: Wrong database password
**Solution**:
- Go back to Supabase Settings → Database
- Reset your database password and update `.env`

### Tables don't exist

**Cause**: Migrations haven't been run
**Solution**:
```bash
npx prisma migrate deploy
```

## Data Persistence

All data is now saved to Supabase:
- ✅ User registrations → Profile table
- ✅ Availability slots → Availability table
- ✅ Appointments → Appointment table
- ✅ Mood logs → MoodLog table
- ✅ Resources → Resource table
- ✅ Session notes → SessionNote table

## Next Steps

1. Once `.env` is configured, **never commit it to git**
2. Start the backend: `npm start`
3. Start the frontend: `cd ../frontend && npm run dev`
4. Test the full flow: Register → Set Availability → Book Appointments
