# Cartoon Voting App

A simple application that allows users to vote for their favorite cartoon characters.

## Project Structure

```
.
├── backend/           # Node.js backend
│   ├── server.js     # Express server
│   ├── package.json  # Backend dependencies
│   └── README.md     # Backend documentation
│
└── frontend/         # Frontend implementations
    ├── app.py        # Streamlit frontend
    ├── index.html    # Web frontend
    ├── styles.css    # Web frontend styles
    ├── app.js        # Web frontend JavaScript
    ├── requirements.txt  # Python dependencies
    └── README.md     # Frontend documentation
```

## Getting Started

1. Start the backend:
```bash
cd backend
npm install
npm start
```

2. Choose your preferred frontend:

   a. Streamlit frontend:
   ```bash
   cd frontend
   # Create and activate virtual environment
   python -m venv venv
   source venv/bin/activate  # On macOS/Linux
   # or
   venv\Scripts\activate  # On Windows
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Run the app
   streamlit run app.py
   ```

   b. Web frontend:
   - Open `frontend/index.html` in your web browser

## Features

- Vote for your favorite cartoon
- Real-time results display
- Two frontend implementations (Streamlit and Web)
- Simple and intuitive interface

## Backend Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on http://localhost:8080

## API Endpoints

- GET `/cartoons` - Get all available cartoons
- POST `/vote` - Vote for a cartoon (send JSON with `id`)
- GET `/results` - Get current voting results