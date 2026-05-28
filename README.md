# Ágora V2 - Sistema de Apoyo Emocional Híbrido

Aplicación web completa mobile-first para apoyo emocional con IA conversacional y supervisión profesional.

## 🚀 Quick Start

### Desarrollo con Docker

```bash
docker-compose up
```

Accede a:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000
- **Base de datos**: PostgreSQL del contenedor `postgres`

### Desarrollo local sin Docker

Instala dependencias desde la raíz y los subproyectos:

```bash
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..
```

Configura los entornos:

**server/.env**
```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/agora
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-...
```

**client/.env.local**
```bash
# Opcional para desarrollo local o Docker.
VITE_API_URL=http://localhost:3001
```

Luego inicia:

```bash
npm run dev
```

Accede a:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001

### Desarrollo por terminales separadas

```bash
# Terminal 1
cd server
npm run dev

# Terminal 2
cd client
npm run dev
```

## 📋 Requisitos

- Node.js >= 16.0.0
- npm >= 8.0.0
- PostgreSQL (para producción)

## 🏗️ Arquitectura

**Full Stack:**
- **Backend:** Express.js + Node.js + Socket.io + JWT
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Base de Datos:** PostgreSQL + Sequelize
- **Estado:** Zustand
- **Comunicación:** REST API + WebSockets

## 📁 Estructura del Proyecto

```
Agora-V2/
├── server/
│   ├── config/          # Configuración DB
│   ├── controllers/      # Lógica de negocio
│   ├── middleware/       # Autenticación, validación
│   ├── models/           # Modelos Sequelize
│   ├── routes/           # Rutas API
│   ├── services/         # Servicios (IA, detección riesgo)
│   ├── utils/            # Utilidades
│   ├── server.js         # Punto de entrada
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/   # Componentes React
│   │   ├── pages/        # Páginas/vistas
│   │   ├── hooks/        # Custom hooks
│   │   ├── stores/       # Estado global
│   │   ├── services/     # Llamadas API
│   │   ├── types/        # TypeScript types
│   │   ├── styles/       # CSS/Tailwind
│   │   └── utils/        # Funciones auxiliares
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── package.json          # Scripts root
├── Procfile              # Heroku deployment
└── .env.example          # Variables de ambiente
```

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Frontend** | React + Vite | 18.2 + 5.0 |
| **Backend** | Express.js | 4.18 |
| **BD** | PostgreSQL | Latest |
| **ORM** | Sequelize | 6.35 |
| **Auth** | JWT + bcryptjs | 9.1 + 2.4 |
| **Real-time** | Socket.io | 4.7 |
| **Estilos** | Tailwind CSS | 3.3 |
| **Estado** | Zustand | 4.4 |
| **HTTP** | Axios | 1.6 |

## 🌍 Despliegue (Heroku)

Está configurado para deploy automático desde GitHub:

1. Push código a GitHub
2. Conecta en Heroku Dashboard: New → Create app → Connect GitHub
3. Selecciona repo y rama `main`
4. Enable "Automatic deploys"
5. ¡Listo! Cada push auto-deploya

**Variables en Heroku:**
```
DATABASE_URL=postgresql://...  (Auto-asignada si usas Heroku Postgres)
JWT_SECRET=tu_secreto
OPENAI_API_KEY=tu_key
```

En Heroku no definas `VITE_API_URL`; el frontend usará el mismo origen HTTPS.

## 📝 Variables de Ambiente

**server/.env:**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/agora
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=sk-...
```

**client/.env.local:**
```
VITE_API_URL=http://localhost:3001
```

## ⚙️ Scripts Disponibles

### Root
```bash
npm run dev              # Dev mode (frontend + backend paralelos)
npm run build            # Build para producción
npm start                # Producción
npm run server:dev       # Solo backend
npm run client:dev       # Solo frontend
```

### Server
```bash
cd server
npm run dev              # Nodemon auto-reload
npm start                # Producción
```

### Client
```bash
cd client
npm run dev              # Vite dev server
npm run build            # Build optimizado
npm run preview          # Previsualizar build
```

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs
- ✅ JWT para autenticación
- ✅ CORS habilitado y restringido
- ✅ Variables sensibles en .env
- ✅ Cifrado de conversaciones (E2E optional)
- ✅ Anonimato de usuario (UUID)

## 📱 Responsive Design

- Mobile-first en Tailwind CSS
- Breakpoints: xs(320px), sm(640px), md(768px), lg(1024px)
- 100% funcional en móvil, tablet, desktop
- WCAG 2.1 AA para accesibilidad

## 🚨 Troubleshooting

| Problema | Solución |
|----------|----------|
| Puerto 5173/3001/5000 en uso | Cambia `PORT` o revisa `docker-compose.yml` |
| Base de datos no conecta | Verifica DATABASE_URL |
| npm install falla | Borra node_modules y npm cache clean |
| Vite no compila | npm install @vitejs/plugin-react |

## 📚 Documentación

- Revisa `docker-compose.yml` para el flujo de desarrollo con Docker
- Revisa `server/config/database.js` para ver la lógica de base de datos
- Revisa `client/src/services/authService.js` para las llamadas API

## 🤝 Contribuir

1. Crea rama: `git checkout -b feature/nombre`
2. Commit: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/nombre`
4. PR a `main`

## 📄 Licencia

MIT


---

**¿Primer contacto?** Comienza por este `README.md` y luego revisa el código fuente en `server/` y `client/`.

