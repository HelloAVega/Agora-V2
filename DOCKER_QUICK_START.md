╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║    🐳 DOCKER - LOCAL DEVELOPMENT (SIN GITHUB PUSHES)             ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝


⚡ QUICK START (30 segundos)
═══════════════════════════════════════════════════════════════════

Windows:
  1. Abre PowerShell/CMD
  2. cd c:\Users\teamv\Downloads\Agora-V2
  3. docker-setup.bat

O directamente:
  docker-compose up


Mac/Linux:
  cd /path/to/Agora-V2
  docker-compose up

O:
  chmod +x docker-setup.sh
  ./docker-setup.sh


🎯 RESULTADO:
═══════════════════════════════════════════════════════════════════

Espera 1-2 minutos para que todo se construya...

Luego verás:

  ✓ Frontend: http://localhost:5173   ← Entra aquí
  ✓ Backend:  http://localhost:5000
  ✓ DB:       localhost:5432


💡 CÓMO FUNCIONA
═══════════════════════════════════════════════════════════════════

docker-compose up hace esto:

1. Construye la imagen del proyecto
2. Inicia 3 servicios en contenedores:
   ├─ agora-dev    (Node.js con hot-reload)
   ├─ postgres     (Base de datos)
   └─ (opcional)

3. Mapea puertos:
   - 5173 (Vite dev server - React hot-reload)
   - 5000 (Express API)
   - 5432 (PostgreSQL)

4. Monitorea cambios en tu código
5. Recompila automáticamente


✏️ EDITA CÓDIGO - VE CAMBIOS AL INSTANTE
═══════════════════════════════════════════════════════════════════

Abre App.jsx:
  client/src/App.jsx

Cambia algo:
  Borra una línea, edita texto, etc.

Guarda:
  Ctrl+S

Resultado:
  ✓ Vite recompila automáticamente
  ✓ Frontend actualiza en http://localhost:5173
  ✓ SIN refresh necesario (HMR)
  ✓ Cambios visibles en <1 segundo


🛑 DETENER
═══════════════════════════════════════════════════════════════════

Presiona: Ctrl+C en la terminal

O en otra terminal:
  docker-compose down


📊 VER LOGS
═══════════════════════════════════════════════════════════════════

En vivo:
  docker logs agora-dev -f

(Presiona Ctrl+C para salir)


═════════════════════════════════════════════════════════════════════
                       ARCHIVOS CREADOS
═════════════════════════════════════════════════════════════════════

✓ Dockerfile           - Producción (simula Heroku)
✓ Dockerfile.dev       - Desarrollo con hot-reload
✓ docker-compose.yml   - Orquestación de servicios
✓ .dockerignore        - Archivos excluidos
✓ docker-setup.bat     - Script Windows
✓ docker-setup.sh      - Script Mac/Linux
✓ DOCKER_LOCAL_DEVELOPMENT.md - Guía completa


═════════════════════════════════════════════════════════════════════
                     SIGUIENTE PASO
═════════════════════════════════════════════════════════════════════

1. Instala Docker Desktop si no lo tienes:
   https://www.docker.com/products/docker-desktop

2. Abre una terminal/PowerShell

3. Navega a la carpeta:
   cd c:\Users\teamv\Downloads\Agora-V2

4. Inicia Docker:
   docker-compose up

5. Abre: http://localhost:5173

6. ¡Empieza a desarrollar sin hacer push a GitHub!


═════════════════════════════════════════════════════════════════════
