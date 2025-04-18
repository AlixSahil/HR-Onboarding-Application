# HR Onboarding System

A comprehensive HR application for managing employee onboarding and information.

## Features

- Employee self-registration with comprehensive information capture
- HR dashboard for employee information retrieval
- Integration with Oracle Express 12c database
- Modern, responsive UI built with Material-UI

## Prerequisites

- Node.js (v14 or higher)
- Oracle Express 12c
- npm or yarn package manager

## Setup Instructions

### Database Setup

1. Install Oracle Express 12c
2. Connect to your Oracle database
3. Run the schema file from `server/database/schema.sql`

### Backend Setup

1. Navigate to the server directory:
```bash
cd hr-app/server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with your database credentials:
```
PORT=5000
ORACLE_USER=your_username
ORACLE_PASSWORD=your_password
ORACLE_CONNECTION_STRING=your_connection_string
```

4. Start the server:
```bash
npm start
```

### Frontend Setup

1. Navigate to the client directory:
```bash
cd hr-app/client
```

2. Install dependencies:
```bash
npm install
```

3. Start the application:
```bash
npm start
```

The application will be available at http://localhost:3000

## Usage

1. New Employee Registration:
   - Navigate to http://localhost:3000
   - Fill in all required information
   - Submit the form

2. HR Dashboard:
   - Navigate to http://localhost:3000/hr
   - Enter Poornata ID to search for employee
   - View complete employee information

## Project Structure

```
hr-app/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   └── src/               # React source files
│       ├── components/    # React components
│       └── App.js         # Main application component
└── server/                # Backend Node.js application
    ├── database/          # Database schema and migrations
    ├── routes/           # API routes
    └── server.js         # Express server setup
``` 