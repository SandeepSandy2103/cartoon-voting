# Cartoon Voting App - Backend

A simple Node.js backend for the cartoon voting application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will run on http://localhost:8080

## API Endpoints

- GET `/cartoons` - Get all available cartoons
- POST `/vote` - Vote for a cartoon (send JSON with `id`)
- GET `/results` - Get current voting results 