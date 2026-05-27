╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║        🐳 DOCKER SETUP - LOCAL DEVELOPMENT GUIDE 🐳               ║
║                                                                    ║
║         Run Ágora V2 Locally with Docker (No GitHub Pushes!)      ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝


════════════════════════════════════════════════════════════════════
                    PREREQUISITOS
════════════════════════════════════════════════════════════════════

✅ INSTALAR DOCKER:

Windows:
  1. Descarga Docker Desktop: https://www.docker.com/products/docker-desktop
  2. Instala siguiendo las instrucciones
  3. Abre PowerShell/CMD y verifica:
     docker --version
     docker-compose --version

Mac:
  brew install docker
  brew install docker-compose

Linux:
  sudo apt-get install docker.io docker-compose


════════════════════════════════════════════════════════════════════
                  OPCIÓN 1: DESARROLLO CON HOT-RELOAD
════════════════════════════════════════════════════════════════════

🔥 MEJOR PARA DESARROLLO (Los cambios se reflejan automáticamente)

PASO 1: Inicia Docker Desktop
────────────────────────────

PASO 2: Construir y ejecutar los contenedores
──────────────────────────────────────────────

cd c:\Users\teamv\Downloads\Agora-V2

docker-compose up

Espera a ver:
  ✓ agora-dev is running
  ✓ Local:   http://localhost:5173
  ✓ Backend: http://localhost:5000


PASO 3: Accede a la aplicación
───────────────────────────────

Frontend: http://localhost:5173
Backend API: http://localhost:5000


PASO 4: ¡Haz cambios en tu código!
────────────────────────────────

Edita cualquier archivo (App.jsx, server.js, etc.)
Los cambios se reflejan AUTOMÁTICAMENTE sin rebuild

PORQUE:
  - Vite dev server monitorea cambios (port 5173)
  - Nodemon monitorea cambios server (port 5000)
  - Hot Module Replacement (HMR) recarga sin perder estado


PASO 5: Ver logs en tiempo real
───────────────────────────────

En la misma terminal ves:
  [5173] Vite build changes
  [5000] Server restarting

Si algo falla, los errores aparecen inmediatamente


PASO 6: Detener los contenedores
──────────────────────────────

Presiona: Ctrl+C

O en otra terminal:
  docker-compose down


════════════════════════════════════════════════════════════════════
                  OPCIÓN 2: PRODUCCIÓN EN DOCKER
════════════════════════════════════════════════════════════════════

📦 PARA SIMULAR HEROKU LOCALMENTE

PASO 1: Construir imagen de producción
───────────────────────────────────────

cd c:\Users\teamv\Downloads\Agora-V2

docker build -t agora:latest .

(Esto toma 2-3 minutos la primera vez)


PASO 2: Ejecutar contenedor
──────────────────────────

docker run -p 5000:5000 agora:latest

Espera a ver:
  ✓ Server running on port 5000


PASO 3: Accede a la aplicación
───────────────────────────────

Abre: http://localhost:5000

Deberías ver la landing page compilada (dist/)
Exactamente como en Heroku


PASO 4: Detener contenedor
──────────────────────────

Presiona: Ctrl+C


════════════════════════════════════════════════════════════════════
                      FLUJO RECOMENDADO
════════════════════════════════════════════════════════════════════

DURANTE DESARROLLO:
1. docker-compose up        (Inicia desarrollo)
2. Edita archivos           (Hot-reload automático)
3. Ver cambios en http://localhost:5173
4. Repite pasos 2-3

ANTES DE HACER PUSH A HEROKU:
1. docker build -t agora:latest .    (Simula Heroku)
2. docker run -p 5000:5000 agora:latest
3. Verifica http://localhost:5000
4. Si funciona en Docker → funcionará en Heroku
5. Entonces: git push origin main


════════════════════════════════════════════════════════════════════
                    COMANDOS ÚTILES
════════════════════════════════════════════════════════════════════

VER CONTENEDORES CORRIENDO:
  docker ps

VER LOGS DE UN CONTENEDOR:
  docker logs agora-dev -f         (en vivo, presiona Ctrl+C para salir)

ENTRAR DENTRO DEL CONTENEDOR:
  docker exec -it agora-dev sh

Dentro del contenedor puedes ejecutar:
  npm run build
  npm install package-name
  etc.

LIMPIAR CONTENEDORES Y IMÁGENES:
  docker-compose down -v           (borra contenedores y volúmenes)
  docker system prune               (limpia imágenes sin usar)


════════════════════════════════════════════════════════════════════
                   ESTRUCTURA DE ARCHIVOS
════════════════════════════════════════════════════════════════════

Archivos Docker creados:
✓ Dockerfile           - Build para producción
✓ Dockerfile.dev       - Build para desarrollo
✓ docker-compose.yml   - Orquestación de servicios
✓ .dockerignore        - Archivos excluidos del build


════════════════════════════════════════════════════════════════════
                    TROUBLESHOOTING
════════════════════════════════════════════════════════════════════

Problema: "Port 5000 already in use"
Solución: 
  docker-compose down
  O cambia el puerto: docker run -p 5001:5000 agora:latest

Problema: "Cannot find module"
Solución:
  docker-compose down -v
  docker-compose up     (reconstruye todo)

Problema: Cambios no se reflejan
Solución:
  1. Verifica que usas docker-compose.yml (development)
  2. Los cambios en client/ ven en http://localhost:5173
  3. Los cambios en server/ se ven después de que Nodemon reinicia
  4. Refresca el navegador (Ctrl+F5)

Problema: "EADDRINUSE: address already in use"
Solución:
  Hay otro proceso en el puerto
  docker ps              (ver qué está corriendo)
  docker kill <CONTAINER_ID>


════════════════════════════════════════════════════════════════════
                   VOLÚMENES EN DOCKER
════════════════════════════════════════════════════════════════════

docker-compose.yml mapea:
  - .:/app              → Tu código local sincronizado en el contenedor
  - /app/node_modules   → node_modules aislados en el contenedor

BENEFICIO:
  ✓ Editas archivos localmente
  ✓ Docker ve los cambios automáticamente
  ✓ Hot-reload funciona
  ✓ Sin necesidad de rebuild


════════════════════════════════════════════════════════════════════
                    PRÓXIMOS PASOS
════════════════════════════════════════════════════════════════════

1. Instala Docker Desktop si no lo tienes
2. Ejecuta: docker-compose up
3. Abre http://localhost:5173
4. Empieza a desarrollar sin hacer push a GitHub
5. Cuando esté listo: git push origin main
6. Heroku auto-deploy


════════════════════════════════════════════════════════════════════
                   ¡LISTO PARA DESARROLLAR! 🚀
════════════════════════════════════════════════════════════════════
