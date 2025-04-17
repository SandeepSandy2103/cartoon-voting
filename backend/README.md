# Cartoon Voting App - Backend

A simple Node.js backend for the cartoon voting application using PostgreSQL and Redis.

## Prerequisites

- Node.js
- PostgreSQL
- Redis

## Setup

1. Install PostgreSQL and Redis:
   - PostgreSQL: [Installation Guide](https://www.postgresql.org/download/)
   - Redis: [Installation Guide](https://redis.io/download)

2. Create PostgreSQL database:
```sql
CREATE DATABASE cartoon_voting;
```

3. Install dependencies:
```bash
npm install
```

4. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` with your configuration

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:8080

## API Endpoints

- GET `/cartoons` - Get all available cartoons (cached for 1 minute)
- POST `/vote` - Vote for a cartoon (send JSON with `id`)
- GET `/results` - Get current voting results (cached for 5 seconds)

## Database Schema

```sql
CREATE TABLE cartoons (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    votes INTEGER DEFAULT 0
);
``` 