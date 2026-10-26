# Despliegue del frontend

Aplicacion Next.js 14 (App Router, TypeScript estricto, HeroUI) que se despliega en Vercel. Este documento cubre requisitos, variables de entorno, publicacion, verificacion, rollback y manejo de secretos. Las rutas de la API viven en el backend; aqui solo se configura su URL base.

## Requisitos

| Requisito | Detalle |
|---|---|
| Node.js | 22 en Vercel. Localmente, Next.js 14.2 exige Node 18.17 o superior; la build fue verificada con Node 22.14.0. |
| Backend desplegado | El frontend no funciona sin la API: todo el estado viene de ella. |
| `package-lock.json` | Versionado. La instalacion en Vercel respeta el lockfile. |
| Dominio del frontend autorizado en el backend | Debe estar en `CLIENT_URL` del backend. Los dominios `*.vercel.app` se aceptan sin configuracion adicional. |

El repositorio **no** incluye `vercel.json`. Vercel detecta el preset Next.js y ejecuta los scripts reales de `package.json`: `npm run build` para construir y `next start` para servir. No hace falta crear un `vercel.json`. `npm start` es el equivalente local para servir un build ya generado.

No hay script de test. La verificacion real es `npm run lint` y `npm run build`; el build es el unico paso que aplica TypeScript estricto, porque `next lint` no lo revisa.

## Variables de entorno

| Variable | Obligatoria | Valor / formato | Efecto real |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | Si | URL absoluta que **debe incluir `/api`**, por ejemplo `https://parqueadero-backend.vercel.app/api` | Es el `baseURL` de axios en `src/services/api.ts`. Las llamadas de los servicios son relativas (`/auth/login`), asi que sin el sufijo `/api` todas apuntan a rutas inexistentes y devuelven 404. |

Puntos que rompen el despliegue:

- La variable se incrusta en el bundle en tiempo de build. Cambiarla en Vercel no afecta a un despliegue ya publicado: hay que volver a desplegar.
- Debe empezar con `http` o `https` y no llevar barra final. `NEXT_PUBLIC_API_URL=http://localhost:3000/api` es correcto en local; en produccion debe ser el dominio real del backend.
- Usar el mismo host en backend y frontend al probar en local (`localhost`, nunca mezclar con `127.0.0.1`): axios envia la cookie al host configurado, y el backend valida el origen por CORS.
- La cookie de sesion vive en el dominio del backend. Cuando el frontend esta en otro dominio, el navegador la trata como cookie de terceros: por eso el backend la emite con `SameSite=None; Secure` y exige HTTPS.
- El prefijo `NEXT_PUBLIC_` hace publico el valor. Nunca colocar secretos, claves de administracion ni cadenas de MongoDB en variables de este proyecto.

## Publicacion en Vercel

1. Importar el repositorio del frontend. Framework preset: **Next.js** (autodetectado). Directorio raiz: la raiz del repositorio.
2. En Settings, General, Node.js Version, seleccionar **22.x**.
3. En Environment Variables, crear `NEXT_PUBLIC_API_URL` con el dominio de la API mas `/api`, en Production, Preview y Development. En Preview conviene un backend de preview distinto.
4. Autorizar el dominio resultante en el backend: agregarlo a `CLIENT_URL` si no es `*.vercel.app`, y redesplegar el backend para que tome la variable.
5. Desplegar desde `main`. La salida de build esperada lista 11 rutas de aplicacion (`/`, `/auth/login`, `/auth/register`, `/auth/logout`, `/dashboard`, `/dashboard/analiticas`, `/dashboard/configuracion`, `/dashboard/perfil`, `/dashboard/usuarios`, `/dashboard/vehiculos/[id]`, `/dashboard/vehiculos/[id]/comentarios/[vehicleId]`), la pagina interna `/_not-found` y la ruta estatica `/icon.png`. Las dos rutas de vehiculos son dinamicas (`ƒ`); el resto se prerenderiza.

Comandos locales equivalentes:

```bash
npm ci
npm run build
npm start          # sirve el build; usa PORT o 3000
```

## Verificacion posterior al despliegue

Usar el dominio publicado en lugar de `WEB`.

1. Carga inicial. `https://WEB/` debe renderizar sin errores en consola. En Network, la primera peticion a `NEXT_PUBLIC_API_URL` no debe ser 404: un 404 indica que falta `/api` en la variable.
2. Login. Entrar a `/auth/login` con un usuario real. Esperado: redireccion a `/dashboard` y una cookie `token` visible en DevTools, Application, Cookies, con dominio del backend, `HttpOnly`, `Secure` y `SameSite=None`.
3. Sesion persistente. Recargar `/dashboard` y comprobar que la sesion sigue activa. Si se pierde, revisar cookies de terceros en el navegador y CORS en el backend.
4. Configuracion y analiticas. `/dashboard/configuracion` debe mostrar las tarifas que devuelve `GET /api/config`, y `/dashboard/analiticas` debe cargar `GET /api/dashboard/metrics`. Con rol `operator` o `user` la escritura de configuracion debe rechazarse.
5. Cierre de sesion. `/auth/logout` debe limpiar la cookie y dejar las rutas de dashboard sin acceso.
6. Build limpio. Confirmar en Vercel que el paso `npm run build` termino con exit code 0 y que `npm run lint` no reporto errores (las advertencias de `react-hooks/exhaustive-deps` no bloquean).

## Rollback

1. Vercel, Deployments, elegir el deployment estable anterior, menu, **Promote to Production**. El alias de produccion cambia sin recompilar.
2. Si el fallo viene de `NEXT_PUBLIC_API_URL`, corregir la variable y redesplegar: el valor anterior queda incrustado en el bundle del deployment promovido.
3. Si el backend cambio de contrato, coordinar el rollback de ambos proyectos. Un frontend nuevo contra un backend antiguo falla igual que al reves.
4. Volver a correr la verificacion de la seccion anterior sobre el deployment promovido.
5. Para volver a una version etiquetada: `git checkout vX.Y.Z`, `npm ci`, `npm run build` en local para confirmar, y desplegar. Las etiquetas siguen SemVer `vMAJOR.MINOR.PATCH`.

## Checklist de secretos

- [ ] `.env.local` no esta versionado: `.gitignore` excluye `.env*.local`. Verificar con `git ls-files | grep -E '\.env'`.
- [ ] Ninguna variable de este proyecto contiene secretos. `NEXT_PUBLIC_*` termina en el bundle publico.
- [ ] La URL de la API es de solo lectura: no se incluyen credenciales en la URL (`https://usuario:clave@...`).
- [ ] `NEXT_PUBLIC_API_URL` apunta a HTTPS en produccion; la cookie exige `secure`.
- [ ] El dominio del frontend esta registrado en `CLIENT_URL` del backend y ese cambio ya fue desplegado.
- [ ] Las variables existen en Production, Preview y Development, y Production no apunta a un backend de pruebas.
