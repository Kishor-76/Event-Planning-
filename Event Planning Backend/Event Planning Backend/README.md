# Event Planning Backend

Backend for the Eventify frontend.

Quick start:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies:

```bash
npm install
```

3. Seed events (optional):

```bash
npm run seed
```

4. Start dev server:

```bash
npm run dev
```

API endpoints:

- `GET /api/events` - list events (query `category`, `search`)
- `GET /api/events/:id` - get event
- `POST /api/events` - create event
- `PUT /api/events/:id` - update event
- `DELETE /api/events/:id` - delete event

- `POST /api/bookings` - create booking
- `GET /api/bookings` - list bookings
- `GET /api/bookings/:id` - booking details
- `PUT /api/bookings/:id/status` - update booking status

- `POST /api/auth/register` - register
- `POST /api/auth/login` - login (returns JWT)
- `GET /api/auth/me` - get current user (requires `Authorization: Bearer <token>`)
