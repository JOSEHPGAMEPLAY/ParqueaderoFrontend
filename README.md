# 🚗 Frontend Parqueadero - Next.js

Este es el frontend del sistema de gestión de parqueadero, desarrollado con **Next.js 14**, **React 18** y una UI moderna utilizando **NextUI** y **TailwindCSS**.

---

## ✨ Tecnologías usadas

* ⚛️ **React 18** + **Next.js 14**
* 🎨 **NextUI** (componentes UI modernos)
* 🎯 **Zod** + **React Hook Form** para validación
* 📦 **Axios** para consumo del API
* 🔐 Manejo de **JWT** para autenticación
* 🌙 **Next Themes** (soporte dark mode)
* 🔧 **ESLint** y **TypeScript** configurado

---

## 🚀 Scripts disponibles

```bash
# Inicia el servidor en desarrollo
npm run dev

# Compila el proyecto para producción
npm run build

# Inicia el servidor de producción
npm start

# Corre el linter (ESLint)
npm run lint
```

---

## 🔐 Variables de entorno necesarias

Crea un archivo `.env.local` con lo siguiente:

```
NEXT_PUBLIC_API_URL=https://api.parqueadero.com
```

> 💡 Importante: Nunca subas tu `.env.local` al repositorio.

---

## 🌐 Despliegue

Este proyecto está listo para ser desplegado en **Vercel** con solo conectar el repositorio y configurar las variables de entorno.

---

## 🎯 Funcionalidades principales

* Gestión de ingreso/salida de vehículos
* Cálculo automático del precio de parqueo
* Interfaz responsiva y accesible
* Alertas con `react-toastify`
* Modo oscuro

---

## 📦 Dependencias destacadas

| Paquete           | Descripción                      |
| ----------------- | -------------------------------- |
| `@nextui-org/*`   | Sistema de diseño de componentes |
| `axios`           | Cliente HTTP                     |
| `react-hook-form` | Formularios reactivos            |
| `zod`             | Validación robusta               |
| `jsonwebtoken`    | Validación JWT                   |
| `next-themes`     | Modo oscuro                      |
| `react-toastify`  | Notificaciones                   |

---

## ⚖️ Licencia

Este proyecto está licenciado bajo los términos de la licencia [MIT con Commons Clause](./LICENSE).

> ⚠️ **No se permite el uso comercial sin autorización explícita del autor.**
