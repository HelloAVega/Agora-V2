# Heroku Build Fix - Complete Solution (v5)

## ❌ Problema Original
```
sh: 1: vite: not found
```

Heroku intentaba ejecutar `vite build` pero Vite no estaba instalado en `client/node_modules` porque:
1. Heroku solo instala en el directorio root
2. `vite` es devDependency en `client/package.json`
3. Los subdirectorios no instalaban sus dependencies automáticamente

## ✅ Solución Aplicada

### 1. Actualizar Node.js/npm a versiones LTS modernas
**Cambio en `package.json`:**
```json
"engines": {
  "node": "20.x",
  "npm": "10.x"
}
```
- Cambié de 18.x (EOL) a 20.x (LTS activo)
- npm 10.x es más estable que 9.x

### 2. Script `install:all` que instala en ambas carpetas
**Nuevo script en `package.json`:**
```json
"install:all": "cd server && npm install --production=false && cd ../client && npm install --production=false && cd .."
```

Este script:
- Entra en `server/` e instala dependencias
- Entra en `client/` e instala dependencias (incluyendo Vite)
- Regresa al root

### 3. Ejecutar `install:all` en heroku-postbuild
**Cambio en `heroku-postbuild`:**
```json
"heroku-postbuild": "npm run install:all && npm run build"
```

**Flujo ahora:**
1. Heroku instala root dependencies
2. Ejecuta `heroku-postbuild`
3. `install:all` instala `server/` y `client/`
4. Luego ejecuta `build` que hace el build del cliente

### 4. Actualizar `.npmrc` para máxima compatibilidad
```
production=false
legacy-peer-deps=true
```

- `production=false`: Force devDependencies installation
- `legacy-peer-deps=true`: Evita warnings de peer dependencies

### 5. Configuración mejorada en `heroku.yml`
```yaml
build:
  languages:
    - nodejs
  config:
    NODE_ENV: production
    NPM_CONFIG_PRODUCTION: false
    BUILDPACK_IGNORE_NODE_MODULES: true

run:
  web: node server/server.js
```

## 📋 Archivos Modificados

| Archivo | Cambios |
|---------|---------|
| `package.json` | Versiones 20.x/10.x, nuevo script `install:all`, `heroku-postbuild` mejorado |
| `.npmrc` | Agregado `legacy-peer-deps=true` |
| `heroku.yml` | Agregado `NPM_CONFIG_PRODUCTION=false` |

## 🆕 Archivos Creados

| Archivo | Propósito |
|---------|-----------|
| `build.sh` | Script bash para testing local del build |

## 🚀 Próximos Pasos

1. **Git push:**
   ```bash
   git add -A
   git commit -m "Fix Heroku build - ensure client dependencies installed"
   git push origin main
   ```

2. **Monitorear Heroku:**
   - Ve a tu app en Heroku Dashboard
   - En "Activity" verás el nuevo deploy
   - Los logs mostrarán:
     ```
     -----> Building on the Heroku-24 stack
     -----> Installing node modules (package.json)
     > agora-v2@1.0.0 heroku-postbuild
     > npm run install:all && npm run build
     
     (instalando server/)
     (instalando client/ ← Aquí Vite se instala)
     (haciendo build)
     ```

3. **Verificar éxito:**
   - Los logs deben terminar con: `deployed to Heroku`
   - NO debe contener: `sh: 1: vite: not found`
   - App debe responder en `https://your-app.herokuapp.com`

## 🔍 Debugging si Sigue Fallando

Si aún falla:

### Opción A: Ver logs completos
```bash
heroku logs --tail -a your-app-name
```

### Opción B: SSH a dyno y verificar directorios
```bash
heroku run bash -a your-app-name
# Dentro del dyno:
ls -la client/node_modules/ | grep vite
ls -la server/node_modules/
```

### Opción C: Verificar environment variables
```bash
heroku config -a your-app-name
```

Asegúrate de que no hay variables que fuercen `NODE_ENV=production` antes de instalar.

## 📊 Comparativa de Soluciones Intentadas

| Intento | Enfoque | Resultado |
|---------|---------|-----------|
| v1 | .npmrc con `production=false` | ❌ No suficiente (solo afecta root) |
| v2 | Agregar `install:all` script | ✅ **Esperado que funcione** |

La diferencia clave: v1 confiaba en que `.npmrc` afectaría subdirectorios. v2 **fuerza explícitamente** que npm instale en cada directorio.

## 💡 Por Qué Esto Funciona

Heroku buildpack para Node.js:
1. Detecta `package.json` y corre `npm install` (root only)
2. Si existe `Procfile` o `heroku-postbuild`, lo ejecuta
3. `heroku-postbuild` ahora ejecuta nuestro script `install:all`
4. Este script navega a `client/` y ejecuta `npm install --production=false`
5. Vite se instala en `client/node_modules`
6. `npm run build` ejecuta `vite build` - ¡Vite existe!
7. Los assets se buildan a `client/dist`
8. Express sirve `client/dist` en producción
9. ✅ Deploy exitoso

## 📝 Notas Importantes

- **No commits**: Asegúrate de hacer `git add` y `git commit` después de estos cambios
- **Timing**: El first deploy después de estos cambios tomará más tiempo (instala más dependencias)
- **Logs**: Monitorea que `npm run install:all` complete sin errores
- **Rollback**: Si necesitas revertir: `git revert HEAD` y push

---

**Última actualización**: 2024  
**Status**: Listo para deploy
