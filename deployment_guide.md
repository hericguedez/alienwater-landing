# Guía de Despliegue en VPS Contabo con Dokploy (Alien Water)

Esta guía contiene todos los pasos detallados, comandos y configuraciones necesarias para desplegar **InsForge** y **n8n** en tu nuevo VPS de Contabo (`167.86.92.113`) utilizando **Dokploy**.

---

## 1. Configuración de DNS (Dominio `alienwatermcbo.com`)

Antes de iniciar con el VPS, configura los siguientes registros **A** en tu proveedor de dominio (GoDaddy, etc.):

| Tipo | Nombre | Valor (IP del VPS) | Propósito |
| :--- | :--- | :--- | :--- |
| **A** | `dokploy` | `167.86.92.113` | Acceso al panel de administración de Dokploy |
| **A** | `n8n` | `167.86.92.113` | Acceso al panel de automatización n8n |
| **A** | `insforge` | `167.86.92.113` | Acceso al backend de base de datos/panel InsForge |

*Nota: La propagación de DNS puede tardar de unos minutos a unas horas.*

---

## 2. Preparación e Instalación de Dokploy

1. Conéctate a tu servidor Contabo por SSH:
   ```bash
   ssh root@167.86.92.113
   ```
2. Actualiza los paquetes del sistema e instala curl si no está presente:
   ```bash
   apt update && apt upgrade -y
   apt install curl -y
   ```
3. Configura el Firewall (UFW) básico:
   ```bash
   ufw allow 22/tcp
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 3000/tcp
   ufw enable
   ```
4. Ejecuta el script oficial de instalación de Dokploy:
   ```bash
   curl -sSL https://dokploy.com/install.sh | sh
   ```
5. Una vez terminada la instalación, ve a `http://167.86.92.113:3000` en tu navegador:
   - Crea tu cuenta de administrador (usuario, email y contraseña).
   - Ve a Ajustes del Servidor y asocia el dominio `dokploy.alienwatermcbo.com` para activar el certificado SSL automático.
   - De ahora en adelante, podrás acceder de forma segura a través de `https://dokploy.alienwatermcbo.com`.

---

## 3. Despliegue de InsForge en Dokploy

Antes de iniciar el despliegue, conéctate a tu VPS por SSH y crea la red compartida de Docker que conectará a InsForge y n8n:
```bash
docker network create shared-network
```

En la interfaz de Dokploy:
1. Crea un **Proyecto** llamado `Alien Water`.
2. Dentro del proyecto, haz clic en **Add Service** -> **Compose**.
3. Nombra al servicio como `insforge` y haz clic en crear.
4. Dirígete a la pestaña **YAML/Editor** del servicio compose y pega la siguiente configuración:

```yaml
version: '3.8'

services:
  postgres:
    image: ghcr.io/insforge/postgres-all:latest
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=85cvLDt6vyf51izBfzwoe
      - POSTGRES_DB=insforge
      - ENCRYPTION_KEY=fb477a3d3c8c690ea0dfa90df23cf6302e9bc25c11bc32c3f875e53bc02ee076
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - insforge-network
      - shared-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

  postgrest:
    image: postgrest/postgrest:v12.2.12
    restart: unless-stopped
    environment:
      PGRST_DB_URI: postgres://postgres:85cvLDt6vyf51izBfzwoe@postgres:5432/insforge
      PGRST_OPENAPI_SERVER_PROXY_URI: https://insforge.alienwatermcbo.com
      PGRST_DB_SCHEMA: public
      PGRST_DB_ANON_ROLE: anon
      PGRST_JWT_SECRET: d97f26d7f98d75cf83d258b38eb15720de0d01ee7c598bc68a6d4ee2fe9b52a1
      PGRST_DB_CHANNEL_ENABLED: true
      PGRST_DB_CHANNEL: pgrst
    ports:
      - "5430:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - insforge-network

  insforge:
    image: ghcr.io/insforge/insforge-oss:v1.5.0
    working_dir: /app
    depends_on:
      postgres:
        condition: service_healthy
      postgrest:
        condition: service_started
    ports:
      - "7130:7130"
      - "7131:7131"
    environment:
      - PORT=7130
      - PROJECT_ROOT=/app
      - API_BASE_URL=https://insforge.alienwatermcbo.com
      - VITE_API_BASE_URL=https://insforge.alienwatermcbo.com
      - JWT_SECRET=d97f26d7f98d75cf83d258b38eb15720de0d01ee7c598bc68a6d4ee2fe9b52a1
      - ENCRYPTION_KEY=fb477a3d3c8c690ea0dfa90df23cf6302e9bc25c11bc32c3f875e53bc02ee076
      - ROOT_ADMIN_USERNAME=admin
      - ROOT_ADMIN_PASSWORD=85cvLDt6vyf51izBfzwoe
      - ADMIN_EMAIL=admin@alienwatermcbo.com
      - ADMIN_PASSWORD=85cvLDt6vyf51izBfzwoe
      - POSTGRES_HOST=postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DB=insforge
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=85cvLDt6vyf51izBfzwoe
      - DATABASE_URL=postgresql://postgres:85cvLDt6vyf51izBfzwoe@postgres:5432/insforge
      - POSTGREST_BASE_URL=http://postgrest:3000
      - STORAGE_DIR=/insforge-storage
      - LOGS_DIR=/insforge-logs
    restart: unless-stopped
    volumes:
      - storage-data:/insforge-storage
      - insforge-logs:/insforge-logs
    networks:
      - insforge-network

  deno:
    image: ghcr.io/insforge/deno-runtime:latest
    working_dir: /app
    depends_on:
      - postgres
      - postgrest
    ports:
      - "7133:7133"
    environment:
      - PORT=7133
      - DENO_ENV=production
      - DENO_DIR=/deno-dir
      - POSTGRES_HOST=postgres
      - POSTGRES_PORT=5432
      - POSTGRES_DB=insforge
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=85cvLDt6vyf51izBfzwoe
      - POSTGREST_BASE_URL=http://postgrest:3000
      - WORKER_TIMEOUT_MS=60000
      - ENCRYPTION_KEY=fb477a3d3c8c690ea0dfa90df23cf6302e9bc25c11bc32c3f875e53bc02ee076
      - JWT_SECRET=d97f26d7f98d75cf83d258b38eb15720de0d01ee7c598bc68a6d4ee2fe9b52a1
    volumes:
      - deno_cache:/deno-dir
    healthcheck:
      test: ["CMD", "wget", "-q", "--spider", "http://127.0.0.1:7133/health"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 15s
    restart: unless-stopped
    networks:
      - insforge-network

volumes:
  postgres-data:
    driver: local
  deno_cache:
    driver: local
  storage-data:
    driver: local
  insforge-logs:
    driver: local

networks:
  insforge-network:
    driver: bridge
  shared-network:
    external: true
```
```

5. En Dokploy, haz clic en **Deploy**.
6. Una vez desplegado, dirígete a la pestaña **Domains / Ports** de la configuración de Dokploy en el servicio Compose, y expón el contenedor `insforge` en el puerto `7130` asignándole el dominio `insforge.alienwatermcbo.com` con SSL/HTTPS habilitado.
7. Para verificar el acceso, ingresa a `https://insforge.alienwatermcbo.com` en tu navegador.

---

## 4. Despliegue de n8n en Dokploy

Para n8n utilizaremos una base de datos PostgreSQL dedicada interna y almacenamiento persistente para garantizar estabilidad en producción.

1. En el mismo proyecto de Dokploy, agrega otro servicio de tipo **Compose**.
2. Nómbralo como `n8n` y haz clic en crear.
3. En la pestaña **YAML/Editor** del servicio, pega la siguiente configuración:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest # Usando Docker Hub principal
    restart: always
    environment:
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=n8n-postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n_user
      - DB_POSTGRESDB_PASSWORD=85cvLDt6vyf51izBfzwoe
      - N8N_HOST=n8n.alienwatermcbo.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.alienwatermcbo.com/
    depends_on:
      - n8n-postgres
    volumes:
      - n8n_data:/home/node/.n8n
    ports:
      - "5678:5678"
    networks:
      - n8n-network
      - shared-network

  n8n-postgres:
    image: postgres:16-alpine
    restart: always
    environment:
      - POSTGRES_DB=n8n
      - POSTGRES_USER=n8n_user
      - POSTGRES_PASSWORD=85cvLDt6vyf51izBfzwoe
    volumes:
      - n8n_postgres_data:/var/lib/postgresql/data
    networks:
      - n8n-network

volumes:
  n8n_data:
  n8n_postgres_data:

networks:
  n8n-network:
    driver: bridge
  shared-network:
    external: true
```

4. Haz clic en **Deploy**.
5. Ve a **Domains / Ports** en Dokploy para el servicio `n8n`, expón el contenedor `n8n` en el puerto `5678` asignándole el dominio `n8n.alienwatermcbo.com` con SSL/HTTPS habilitado.
6. Ahora puedes acceder de forma segura a `https://n8n.alienwatermcbo.com`.

---

## 5. Aplicar el Esquema e importar Datos a la Base de Datos

Una vez que InsForge está activo, debemos aplicar la estructura SQL contenida en `schema.sql`.

### Opción A (Consola de SQL en InsForge):
1. Inicia sesión en el panel web de InsForge (`https://insforge.alienwatermcbo.com`) con las credenciales que configuraste en `ROOT_ADMIN_USERNAME`/`PASSWORD`.
2. Dirígete a la sección de **SQL Console** o Base de Datos.
3. Copia el contenido completo de `schema.sql` y ejecútalo para crear las tablas `users`, `payments`, `dispenses` e índices.

### Opción B (Desde SSH usando docker exec):
Puedes inyectar el archivo SQL directamente al contenedor ejecutando esto desde el SSH del VPS:
```bash
# Copiar schema.sql al VPS (puedes crearlo con nano schema.sql y pegar su contenido)
# Luego ejecutar:
docker exec -i $(docker ps -q -f name=postgres) psql -U postgres -d insforge < schema.sql
```

---

## 6. Configuración del Flujo en n8n

1. Entra a `https://n8n.alienwatermcbo.com` y crea tu usuario de acceso.
2. Crea un nuevo flujo de trabajo (Workflow) y selecciona la opción de **Import from File**. Sube el archivo `workflow.json`.
3. Configuración de Credenciales:
   - Busca el nodo de base de datos **PostgreSQL** y abre su configuración.
   - Crea una nueva credencial de conexión PostgreSQL:
     - **Host:** `postgres` (ya que n8n e InsForge están conectados mediante la red Docker `shared-network`).
     - **Port:** `5432`
     - **Database:** `insforge`
     - **User:** `postgres`
     - **Password:** *Tu clave configurada en InsForge*
   - Abre los nodos de HTTP Request (yCloud) y configura las credenciales HTTP Header con tu Token de API definitivo de yCloud.
   - Abre el nodo de verificación de Pabilo y actualiza la AppKey/URL del backend en producción.
4. Haz clic en **Save** y luego activa el flujo de trabajo (**Active** arriba a la derecha).

---

## 7. Activación final de WhatsApp (yCloud Webhook)

1. En el nodo webhook inicial de n8n, copia la URL de producción (Production Webhook URL). Debería lucir así:
   `https://n8n.alienwatermcbo.com/webhook/f7a5b3d9-9e8c-4a3d-8c2b-6d1a9e8f7a6b/path`
2. Ve al panel de control de tu cuenta **yCloud** (WhatsApp API).
3. Busca la sección de configuración de números de teléfono o webhooks.
4. Actualiza la URL de webhook entrante (Inbound Webhook URL) pegando tu nueva dirección de n8n.
5. Guarda los cambios.

---

## 8. Despliegue de la Landing Page (alienwatermcbo.com)

La landing page es una aplicación SPA en React + Vite. Tienes dos opciones para desplegarla en tu VPS:

* **Opción A (Recomendada - Con Git):** Compila directamente en el VPS mediante Dockerfile jalando el código desde GitHub.
* **Opción B (Sin Git - Subiendo ZIP):** Compila localmente en tu computadora, subes el archivo `dist.zip` al VPS y lo sirves usando un Nginx en Dokploy mediante Compose. Esto es ideal para ahorrar memoria RAM en tu VPS Contabo y no requerir Git.

---

### Paso General Común: Configurar DNS
En tu proveedor de dominio (GoDaddy, etc.), agrega los registros **A** para tu dominio principal y el subdominio www apuntando a tu VPS (`167.86.92.113`):

| Tipo | Nombre | Valor (IP del VPS) | Propósito |
| :--- | :--- | :--- | :--- |
| **A** | `@` (o vacío) | `167.86.92.113` | Apunta el dominio principal `alienwatermcbo.com` |
| **A** | `www` | `167.86.92.113` | Soporte para `www.alienwatermcbo.com` |

---

### MÉTODOS DE DESPLIEGUE:

#### OPCIÓN A: Con Git (GitHub/GitLab)

1. **Subir el código a GitHub:**
   ```bash
   git init
   git branch -M main
   git add .
   git commit -m "feat: landing page"
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```
2. **Conectar GitHub en Dokploy:**
   - Ve a **Settings** -> **Git Providers** en Dokploy y enlaza tu cuenta de GitHub.
3. **Crear Servicio en Dokploy:**
   - En tu proyecto, haz clic en **Add Service** -> **Application**.
   - **Source:** Selecciona tu repositorio y la rama `main`.
   - **Build:** Selecciona **Dockerfile** (usará el `Dockerfile` de la raíz del proyecto).
   - Haz clic en **Deploy**.
4. **Asociar Dominio:**
   - En la pestaña **Domains**, añade `alienwatermcbo.com` apuntando al Container Port **`80`** con **SSL (HTTPS)** activado.

---

#### OPCIÓN B: Sin Git (Subiendo ZIP Compilado)

Este método es el más ligero para el VPS, ya que no consume memoria RAM compilando en el servidor.

1. **Compilar localmente en tu computadora:**
   - Ejecuta en la terminal de tu proyecto local:
     ```bash
     npm run build
     ```
   - Esto creará una carpeta llamada `dist/` en tu proyecto.
2. **Crear el archivo ZIP:**
   - Comprime únicamente los archivos que están **dentro** de la carpeta `dist/` en un archivo llamado `dist.zip`.
3. **Crear carpeta en el VPS y subir el archivo:**
   - Conéctate a tu VPS por SSH o mediante un cliente SFTP (como FileZilla o MobaXterm).
   - Crea el directorio para la web:
     ```bash
     mkdir -p /home/alienwater-web/dist
     ```
   - Sube tu archivo `dist.zip` directamente a la carpeta `/home/alienwater-web/dist` en el VPS.
4. **Descomprimir en el VPS:**
   - Ejecuta en la terminal SSH de tu VPS:
     ```bash
     cd /home/alienwater-web/dist
     unzip dist.zip
     # Nota: Si unzip no está instalado, corre: apt install unzip -y
     ```
   - Asegúrate de que los archivos como `index.html` y la carpeta `assets` queden sueltos directamente dentro de `/home/alienwater-web/dist`.
5. **Crear Servicio en Dokploy:**
   - En tu proyecto de Dokploy, haz clic en **Add Service** -> **Compose**.
   - Asígnale el nombre `landing-page`.
   - En la pestaña **YAML/Editor**, pega la siguiente configuración para montar la carpeta en un servidor web Nginx:
     ```yaml
     version: '3.8'

     services:
       web:
         image: nginx:stable-alpine
         volumes:
           - /home/alienwater-web/dist:/usr/share/nginx/html
         restart: always
     ```
   - Haz clic en **Deploy**.
6. **Asociar Dominio:**
   - Ve a la pestaña **Domains / Ports** de este servicio compose en Dokploy.
   - En la sección de dominios de la aplicación `web`, añade `alienwatermcbo.com` apuntando al Container Port **`80`** con **SSL (HTTPS)** activado.

---

¡Listo! Con cualquiera de las dos opciones, tu landing page de Alienwater estará activa y segura en `https://alienwatermcbo.com`.


