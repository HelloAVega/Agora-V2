# Ágora V2 - Full-Stack Application

A modern full-stack application built with Node.js and React, designed for scalability and ease of deployment.

## Project Structure

```
agora-v2/
├── client/                 # React frontend application
├── server/                 # Node.js backend API
├── package.json           # Root package.json with workspace scripts
├── Procfile               # Heroku deployment configuration
├── .env.example           # Environment variables template
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **PostgreSQL** (for database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd agora-v2
   ```

2. **Install root dependencies:**
   ```bash
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd client && npm install && cd ..
   ```

4. **Install server dependencies:**
   ```bash
   cd server && npm install && cd ..
   ```

5. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your local configuration (database URL, API keys, etc.)

6. **Set up the database:**
   ```bash
   cd server
   npm run migrate
   cd ..
   ```

### Running Locally

#### Development Mode (Both client and server with hot reload)
```bash
npm run dev
```
This starts:
- **Client:** http://localhost:5173 (React dev server)
- **Server:** http://localhost:3001 (API server)

#### Production Mode
```bash
npm run build
npm start
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both client and server in development mode (concurrently) |
| `npm start` | Start server in production mode |
| `npm run build` | Build both client and server for production |
| `npm run client:dev` | Start only the client in dev mode |
| `npm run client:build` | Build only the client |
| `npm run server:dev` | Start only the server in dev mode |
| `npm run server:build` | Build only the server |

## Deployment to Heroku

### Prerequisites
- Heroku CLI installed
- Heroku account

### Steps

1. **Create a Heroku app:**
   ```bash
   heroku create <app-name>
   ```

2. **Add PostgreSQL addon:**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
   ```

3. **Set environment variables:**
   ```bash
   heroku config:set JWT_SECRET=<your_secret> -a <app-name>
   heroku config:set OPENAI_API_KEY=<your_key> -a <app-name>
   heroku config:set NODE_ENV=production -a <app-name>
   ```

4. **Deploy:**
   ```bash
   git push heroku main
   ```

5. **View logs:**
   ```bash
   heroku logs --tail -a <app-name>
   ```

## Environment Variables

Create a `.env` file based on `.env.example`:

```
NODE_ENV=development           # development or production
PORT=3001                      # Server port
DATABASE_URL=...               # PostgreSQL connection string
JWT_SECRET=...                 # Secret for JWT token signing
FRONTEND_URL=...               # Frontend URL (for CORS)
OPENAI_API_KEY=...             # OpenAI API key (if using)
```

## Architecture

### Frontend (Client)
- React with Vite
- Modern UI components
- API integration via fetch/axios

### Backend (Server)
- Node.js with Express
- RESTful API design
- PostgreSQL database
- JWT authentication

## Development

### Client Development
Navigate to the `client/` directory for frontend-specific documentation.

### Server Development
Navigate to the `server/` directory for backend-specific documentation.

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally
4. Submit a pull request

## License

MIT

## Support

For issues or questions, please open an issue in the repository.
