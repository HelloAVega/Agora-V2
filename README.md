# Ágora V2 - Sistema de Apoyo Emocional Híbrido

Aplicación web completa mobile-first para apoyo emocional con IA conversacional y supervisión profesional.

## 🚀 Quick Start

```bash
# 1. Crear estructura del proyecto
node setup-full.js

# 2. Instalar dependencias
npm install
cd server && npm install
cd ../client && npm install
cd ..

# 3. Configurar variables de ambiente
cp server/.env.example server/.env
cp client/.env.example client/.env.local

# 4. Iniciar en desarrollo
npm run dev
```

Accede a:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

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

## 📝 Variables de Ambiente

**server/.env:**
```
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:pass@localhost:5432/agora
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=sk-...
```

**client/.env.local:**
```
VITE_API_URL=http://localhost:3001/api
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
| Puerto 3000/3001 en uso | Cambia PORT en .env |
| Base de datos no conecta | Verifica DATABASE_URL |
| npm install falla | Borra node_modules y npm cache clean |
| Vite no compila | npm install @vitejs/plugin-react |

## 📚 Documentación

- Ver `START_HERE.md` para setup paso a paso
- Ver especificación funcional en documentos incluidos
- Arquitectura en `5.2` de especificación

## 🤝 Contribuir

1. Crea rama: `git checkout -b feature/nombre`
2. Commit: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/nombre`
4. PR a `main`

## 📄 Licencia

MIT

---

**¿Primer contacto?** Comienza por `START_HERE.md` →

