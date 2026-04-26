# NUST Mental Health Support

Clean setup guide for running the full project on a new PC.

## 1. Requirements

- Node.js 20+
- npm 10+
- Git

Check versions:

```bash
node -v
npm -v
git --version
```

## 2. Clone and install

```bash
git clone https://github.com/DavidnPhillipus/NUST-Mental-Health-Support.git
cd NUST-Mental-Health-Support
npm install
```

This project uses npm workspaces, so this installs both frontend and backend dependencies.

## 3. Backend environment (SQLite)

Create a file at backend/.env with:

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=4000
```

## 4. Initialize database

From the project root:

```bash
npm run prisma:generate
npm --workspace backend run prisma:reset
```

This creates/resets the SQLite database with no sample records.

## 5. Run the app

Open 2 terminals from the project root.

Terminal 1 (backend):

```bash
npm run dev:backend
```

Terminal 2 (frontend):

```bash
npm run dev:frontend
```

## 6. Open in browser

- Frontend: http://localhost:5173
- Backend health: http://localhost:4000/api/health

## 7. Optional build check

```bash
npm run build:frontend
```

## 8. Troubleshooting

- If backend fails to start, confirm backend/.env exists and has the SQLite DATABASE_URL above.
- If Prisma complains, rerun:

```bash
npm run prisma:generate
npm --workspace backend run prisma:reset
```

- If port 4000 is busy, change PORT in backend/.env.


THIS WAS KINDA FUN
