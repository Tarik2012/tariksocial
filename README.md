Cómo arrancar el proyecto:

# 🚀 TariSocial – Entorno de Desarrollo con Docker

## Cómo arrancar el proyecto

```bash
docker compose up
```

- **Backend (Django)** → [http://localhost:8000](http://localhost:8000)
- **Frontend (React/Vite)** → [http://localhost:5173](http://localhost:5173)

Para detenerlo:

```bash
CTRL + C
docker compose down   # si quieres liberar contenedores
```

---

## Cómo se solucionó el problema de los cambios

Al principio, cada vez que editábamos código había que hacer un **build** completo:

```bash
docker compose up --build
```

✅ Ahora ya **no hace falta** gracias a:

1. **Volúmenes en `docker-compose.yml`**

   - Backend:
     ```yaml
     volumes:
       - .:/app
     ```
   - Frontend:
     ```yaml
     volumes:
       - ./frontend:/app
       - /app/node_modules
     ```

2. **Comandos en modo desarrollo**

   - Backend:
     ```yaml
     command: python manage.py runserver 0.0.0.0:8000
     ```
   - Frontend:
     ```yaml
     command: npm run dev
     ```

3. **Configuración de Vite para Docker/Windows**  
   Archivo `frontend/vite.config.js`:

   ```js
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     server: {
       host: "0.0.0.0",
       watch: {
         usePolling: true,
       },
     },
   });
   ```

---

## Resultado

- Los cambios en el **backend** y **frontend** se reflejan automáticamente.
- Solo necesitas `docker compose up` para trabajar.
- Hot Reload funcionando en Django y Vite.
