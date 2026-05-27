✅ FIXED - Docker Issues Resolved
═══════════════════════════════════════════════════════════════════

❌ PROBLEMAS ENCONTRADOS:
──────────────────────────
1. nodemon no instalado en server/
2. Vite escuchando en puerto 3000 (debería ser 5173)
3. Puerto proxy incorrecto (3001 debería ser 5000)


✅ CAMBIOS REALIZADOS:
─────────────────────

1. SERVER/PACKAGE.JSON
   AGREGADO: "nodemon": "^3.0.2" en devDependencies
   
   Ahora:
   - npm run dev usará nodemon
   - Server se reiniciará cuando cambies server.js

2. CLIENT/VITE.CONFIG.JS
   CAMBIOS:
   ├─ port: 3000 → port: 5173
   ├─ host: (agregado) → '0.0.0.0' (accesible desde Docker)
   └─ proxy target: 'http://localhost:3001' → 'http://localhost:5000'
   
   Ahora:
   - Frontend escucha en puerto correcto
   - Puede accederse desde fuera de localhost
   - API proxy apunta al servidor correcto


════════════════════════════════════════════════════════════════════
                      PASOS PARA CONTINUAR
════════════════════════════════════════════════════════════════════

En PowerShell:

1. DETÉN Docker actual:
   Ctrl+C

2. LIMPIAR TODO:
   docker-compose down -v

3. RECONSTRUIR:
   docker-compose up --build

4. ESPERA 2-3 MINUTOS

5. VERIFICA LOS LOGS:
   [0] Server running on port 5000
   [1] VITE listening on http://localhost:5173

6. ABRE EN NAVEGADOR:
   http://localhost:5173


════════════════════════════════════════════════════════════════════
                    RESULTADO ESPERADO
════════════════════════════════════════════════════════════════════

En la terminal verás:

✓ Terminal 1 (docker-compose up):
  [0] Server running on port 5000
  [0] (Listening for file changes...)
  [1] VITE v5.4.21  ready in XXX ms
  [1] ➜  Local:   http://localhost:5173/
  [1] ➜  Network: use --host to expose

✓ En el navegador:
  http://localhost:5173 carga la landing page
  
✓ Cambios en tiempo real:
  Edita App.jsx → Se recompila automáticamente
  Edita server.js → Se reinicia automáticamente


════════════════════════════════════════════════════════════════════
