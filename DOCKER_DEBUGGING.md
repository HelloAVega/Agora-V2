🔧 DEBUGGING - Docker No Responde
════════════════════════════════════════════════════════════════════

❌ PROBLEMA: ERR_EMPTY_RESPONSE en localhost:5173

Significa: Docker está corriendo pero NO está escuchando en ese puerto


════════════════════════════════════════════════════════════════════
                  SOLUCIÓN - PASO 1: VER LOGS
════════════════════════════════════════════════════════════════════

Abre una NUEVA terminal/PowerShell y ejecuta:

docker logs agora-dev -f

Esto te mostrará qué está pasando en el contenedor

BUSCA:
  ✓ "VITE v5.4.21 listening on http://localhost:5173"
  ✓ "Server running on port 5000"
  
  O busca:
  ❌ "Error"
  ❌ "ENOENT"
  ❌ "Module not found"


════════════════════════════════════════════════════════════════════
                  SOLUCIÓN - PASO 2: VER CONTENEDORES
════════════════════════════════════════════════════════════════════

En otra terminal:

docker ps

Deberías ver:
  - agora-dev     (Status: Up)
  - agora-postgres (Status: Up)

Si dice "Exit" o "Exited" → El contenedor se detuvo


════════════════════════════════════════════════════════════════════
                  SOLUCIÓN - PASO 3: RECONSTRUIR
════════════════════════════════════════════════════════════════════

Detén todo:
  docker-compose down -v

Limpia:
  docker system prune -f

Reconstruye:
  docker-compose up --build

Espera a ver en los logs:
  "Server running on port 5000"
  "VITE listening on http://localhost:5173"

Luego intenta:
  http://localhost:5173


════════════════════════════════════════════════════════════════════
                  ERRORES COMUNES Y FIXES
════════════════════════════════════════════════════════════════════

ERROR: "Cannot find module 'react'"
FIX: npm install no completó
  → docker-compose down -v && docker-compose up --build

ERROR: "Port 5173 already in use"
FIX: Otro proceso usa el puerto
  → netstat -ano | findstr :5173  (ver qué usa)
  → docker kill <CONTAINER_ID>

ERROR: "ECONNREFUSED"
FIX: No es problema de Docker
  → Verifica que estés usando puerto correcto (5173)
  → Espera 1-2 minutos más

ERROR: "vite build" falla
FIX: Compilación de cliente falló
  → Ver logs completos: docker logs agora-dev
  → Busca qué archivo tiene error


════════════════════════════════════════════════════════════════════
                    FLUJO DE DEBUGGING
════════════════════════════════════════════════════════════════════

1. Terminal 1:
   docker-compose up --build

2. Terminal 2 (mientras se está compilando):
   docker logs agora-dev -f

3. Si ves errores:
   Presiona Ctrl+C en Terminal 1

4. Ejecuta lo del "PASO 3: RECONSTRUIR"

5. Intenta de nuevo

6. Si SIGUE FALLANDO:
   Comparte el output de: docker logs agora-dev


════════════════════════════════════════════════════════════════════
