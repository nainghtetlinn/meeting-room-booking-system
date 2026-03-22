# Meeting Room Booking System

## Run Locally With Docker Compose

### 1) Clone the repo

```bash
git clone https://github.com/nainghtetlinn/meeting-room-booking-system.git
cd meeting-room-booking-system
```

### 2) Create env files

**Root `.env`** (used by `docker-compose.yml`)

```bash
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=meeting_room

SEED_USER_NAME=admin
SEED_USER_ROLE=admin

# API URL used by the frontend build (browser will call this)
VITE_API_URL=http://localhost:3020
```

### 3) Build and run

```bash
docker compose up --build
```

### 4) Open the app

- Frontend: http://localhost:3030
- Backend (API): http://localhost:3020
- Swagger: http://localhost:3020/api
- Postgres: localhost:3010

## Notes

- The frontend runs in the browser, so it must call the backend via the **host mapped port** (`http://localhost:3020`).
- Inside Docker, the backend connects to Postgres via the service name `db` on port `5432`.
- On first run, a default user is created if the users table is empty.
