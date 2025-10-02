# 🔄 Hot Reload en TariSocial (Docker + Django + React)

Antes, cada vez que cambiaba algo en el código, había que hacer:

```bash
docker compose up --build
```

Ahora los cambios se reflejan directamente gracias a 3 cosas:

---

## 1️⃣ Volúmenes en docker-compose.yml
El contenedor no usa una copia del código, sino la carpeta real del PC:

```yaml
backend:
  volumes:
    - .:/app

frontend:
  volumes:
    - ./frontend:/app
    - /app/node_modules
```

---

## 2️⃣ Comandos de desarrollo
- **Backend**:
  ```yaml
  command: python manage.py runserver 0.0.0.0:8000
  ```
- **Frontend**:
  ```yaml
  command: npm run dev
  ```

👉 Esto permite que Django y Vite detecten cambios al instante.

---

## 3️⃣ Configuración de Vite
Archivo `frontend/vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    watch: {
      usePolling: true
    }
  }
})
```

👉 Esto arregla el problema de Windows + Docker para que Vite detecte cambios.

---

## ✅ Resultado
- Solo necesitas `docker compose up` para trabajar.  
- Cambios en el backend y frontend se reflejan automáticamente.  
- Sin rebuild ni reinicio de contenedores.

---

# 📦 Instalar librerías nuevas

## 🔹 Python (Django)
1. Añadir el paquete a `requirements.txt`:
   ```
   Pillow
   djangorestframework
   ```
2. Reconstruir backend:
   ```bash
   docker compose build backend
   docker compose up
   ```

## 🔹 Node/React (Frontend)
1. Entrar al contenedor del frontend:
   ```bash
   docker compose exec frontend sh
   ```
2. Instalar el paquete:
   ```bash
   npm install paquete-nuevo
   ```
   👉 Esto actualiza `package.json` y `package-lock.json` en tu código local.
