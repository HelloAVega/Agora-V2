# Ágora V2 - Aplicación web de apoyo emocional

Aplicación web full-stack para acompañamiento emocional con chat asistido por IA, seguimiento del estado de ánimo e historial personal.

## Funcionalidades principales

- Registro e inicio de sesión con JWT.
- Chat con sesiones persistentes.
- Respuestas del asistente con soporte Markdown.
- Check-in emocional rápido (bien / regular / mal) con nota opcional.
- Panel de resumen con recomendación generada por IA.
- Línea de tiempo emocional por semanas.
- Ajustes de perfil: nombre, email, avatar y cambio de contraseña.

## Stack actual

- **Frontend:** React 18 + Vite + Tailwind CSS + Zustand
- **Backend:** Node.js + Express + Sequelize
- **Base de datos:** PostgreSQL (por `DATABASE_URL`) o SQLite local (fallback)
- **Auth:** JWT + bcryptjs
- **Tiempo real:** Socket.IO
- **IA:** Gemini API

## Requisitos

- Node.js **22.x**
- npm **11.x**

## Estructura del proyecto

```txt
Agora-V2/
├── client/                # Frontend React + Vite
├── server/                # API Express + Sequelize
├── docker-compose.yml     # Entorno de desarrollo con contenedores
├── package.json           # Scripts raíz
└── README.md
```

## Variables de entorno

### `server/.env` (o variables del entorno en producción)

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://localhost:5432/agora   # opcional si usas SQLite
SQLITE_STORAGE=./server/data/agora.sqlite                       # fallback local
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-flash-latest
```

### `client/.env.local` (opcional)

```bash
VITE_API_URL=http://localhost:3001
```

> Si no defines `VITE_API_URL`, el frontend usa rutas relativas (`/api/...`), útil cuando backend y frontend comparten dominio en producción.

## Instalación y ejecución

### Opción 1: desarrollo local

```bash
npm install
npm run install:all
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- Healthcheck: http://localhost:3001/api/health

### Opción 2: con Docker

```bash
docker-compose up
```

## Scripts disponibles

### Raíz

```bash
npm run dev           # frontend + backend en paralelo
npm run build         # build del frontend
npm start             # levanta server/server.js
npm run install:all   # instala dependencias de server y client
npm run server:dev    # backend en modo desarrollo
npm run client:dev    # frontend en modo desarrollo
npm run client:build  # build del frontend
```

### Server

```bash
cd server
npm run dev
npm start
```

### Client

```bash
cd client
npm run dev
npm run build
npm run preview
```

## API base

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/change-password`
- `POST /api/auth/me/avatar`
- `GET /api/chat/sessions`
- `POST /api/chat/sessions`
- `GET /api/chat/thread`
- `POST /api/chat/message`
- `POST /api/mood/checkin`
- `GET /api/mood/entries`
- `GET /api/mood/insights`
- `GET /api/mood/timeline`
- `POST /api/mood/generate`
