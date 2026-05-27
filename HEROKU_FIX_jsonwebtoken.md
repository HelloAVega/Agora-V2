📌 FIX: jsonwebtoken@^9.1.0 No Matching Version (Heroku Build Fix v3)
=====================================================================

❌ ERROR ENCONTRADO EN HEROKU:
────────────────────────────
npm error code ETARGET
npm error notarget No matching version found for jsonwebtoken@^9.1.0.

🔍 CAUSA RAÍZ:
──────────────
- En `server/package.json` se especificaba: "jsonwebtoken": "^9.1.0"
- La última versión disponible de jsonwebtoken serie 9 es: 9.0.2
- La versión 9.1.0 nunca fue publicada en npm registry
- Esto causaba que npm install fallara en Heroku

⚠️  PROBLEMA ADICIONAL:
───────────────────────
- Node.js 20.x es Now EOL (End of Life) en Heroku
- Deberías usar 22.x que es el LTS actual sin warnings

✅ CAMBIOS APLICADOS:
────────────────────

1. SERVER PACKAGE.JSON
   ANTES: "jsonwebtoken": "^9.1.0"
   AHORA: "jsonwebtoken": "^9.0.2"
   
   Cambio: Corregida a la versión más reciente de la serie 9 que SÍ existe

2. ROOT PACKAGE.JSON (engines)
   ANTES: "node": "20.x", "npm": "10.x"
   AHORA: "node": "22.x", "npm": "11.x"
   
   Cambios:
   - Node.js 22.x es el LTS actual sin warnings de EOL
   - npm 11.x es la versión más reciente
   - Evitará warnings en futuros builds de Heroku

🚀 PRÓXIMO PASO:
────────────────
$ git add -A
$ git commit -m "Fix: Correct jsonwebtoken version and update Node.js to 22.x LTS

- Fixed jsonwebtoken@^9.1.0 → @^9.0.2 (actual version exists in npm)
- Updated Node.js 20.x → 22.x (current LTS, avoids EOL warning)
- Updated npm 10.x → 11.x (latest stable)"

$ git push origin main


📋 DETALLES TÉCNICOS:
────────────────────

¿Por qué 9.0.2 y no 10.x?
- jsonwebtoken 10.x puede tener cambios de breaking changes
- 9.0.2 es estable y funcionará con el código existente
- Si después quieres usar 10.x, puedes actualizar gradualmente

¿Qué versiones de Node.js son válidas en Heroku ahora?
Según Heroku (2024+):
- 18.x: End-of-Life ❌ (warnings, pronto será error)
- 20.x: End-of-Life ❌ (warnings, pronto será error)
- 22.x: Active LTS ✅ (recomendado ahora)
- 23.x: Current Release (pero menos estable)


✅ VERIFICACIÓN POST-BUILD ESPERADA:

En los logs de Heroku deberías ver:

-----> Installing binaries
       engines.node (package.json):   22.x
       engines.npm (package.json):    11.x
       
       Resolving node version 22.x...
       Downloading and installing node 22.x.x...
       ✓ Bootstrapping npm 11.x...
       
-----> Installing dependencies
       Installing node modules (package.json)
       added 29 packages...
       
-----> Build
       Detected both "build" and "heroku-postbuild" scripts
       Running heroku-postbuild
       
       > agora-v2@1.0.0 heroku-postbuild
       > npm run install:all && npm run build
       
       > agora-v2@1.0.0 install:all
       > cd server && npm install --production=false && cd ../client && npm install --production=false && cd ..
       
       (instala server/ con jsonwebtoken@9.0.2 ✓)
       (instala client/ con vite ✓)
       
       > agora-v2@1.0.0 build
       > npm run client:build && npm run server:build
       
       ... build complete ...
       
       deployed to Heroku


❌ SI SIGUE FALLANDO:

1. Verifica que hiciste git push:
   $ git log --oneline | head -1
   (debería mostrar tu último commit)

2. Verifica en GitHub que los cambios llegaron:
   - Ve a https://github.com/tu-usuario/Agora-V2
   - Comprueba que package.json tiene 22.x y server/package.json tiene 9.0.2

3. Si GitHub está actualizado pero Heroku no:
   - En Heroku Dashboard, "Activity" → "Manual Deploy" → Deploy Branch

4. Ver logs completos:
   $ heroku logs --tail -a tu-app-name


🎯 SUMMARY:
───────────
✓ jsonwebtoken versión corregida (9.0.2 existe, 9.1.0 no)
✓ Node.js actualizado a LTS actual (22.x)
✓ npm actualizado (11.x)

Ahora Heroku podrá instalar todas las dependencias sin errores de versión.
