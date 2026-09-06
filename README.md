# Practica Semana 2 React

Frontend desarrollado con React, Vite y Tailwind CSS. La aplicación permite gestionar clientes, productos y ventas desde un dashboard.

## Requisitos

Antes de iniciar, instala lo siguiente:

- Node.js `22.15.0` o una versión compatible de Node 22.
- npm, incluido con Node.js.
- Git, para clonar el repositorio.
- Docker Engine y Docker Compose v2, únicamente si se usará la ejecución con contenedores.

Comprueba las versiones instaladas:

```bash
node --version
npm --version
docker --version
docker compose version
```

## Instalación local

1. Clona el repositorio y entra en la carpeta del proyecto:

	```bash
	git clone git@github.com:javiervillca-lab/practicaSemana2React.git
	cd practicaSemana2React
	```

2. Instala las dependencias del frontend:

	```bash
	npm install
	```

	Este comando instala React, React DOM, Vite, Tailwind CSS, el plugin de React para Vite, el compilador de React y Oxlint a partir de `package.json`.

3. Inicia el servidor de desarrollo:

	```bash
	npm run dev
	```

4. Abre la URL mostrada por Vite, normalmente `http://localhost:5173`.

El servidor de desarrollo se inicia en otra interfaz o puerto con:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

## Configuración del backend

El frontend realiza solicitudes a una API que debe estar disponible en `http://localhost:8008`. Antes de probar el login, clientes, productos o ventas, inicia el backend y verifica que exponga al menos estos endpoints:

- `POST /api/auth`
- `GET` y `POST /api/customers`
- `GET` y `POST /api/products`
- `GET` y `POST /api/sales`

Las operaciones de actualización y consulta por recurso también utilizan la URL indicada por el campo `@id` de las respuestas de la API, anteponiendo `http://localhost:8008`.

El backend debe permitir solicitudes CORS desde el origen donde se ejecuta el frontend. En desarrollo, permite `http://localhost:5173`; si usas Docker, permite también `http://localhost:4400`.

> Actualmente la URL del backend está definida directamente en los componentes del frontend. No es necesario crear un archivo `.env` para ejecutar esta versión.

## Comandos disponibles

```bash
npm run dev       # Inicia Vite con recarga en caliente
npm run build     # Genera la versión optimizada en dist/
npm run preview   # Sirve localmente la compilación de producción
npm run lint      # Ejecuta Oxlint
```

Para validar una compilación de producción:

```bash
npm run build
npm run preview
```

## Ejecución con Docker

### Desarrollo

La imagen de desarrollo utiliza Node `22.15.0-alpine`, instala las dependencias y monta el código fuente dentro del contenedor.

```bash
make build  # Instalamos los contendores..
make up     # levantamos el contendor..
```

Después, abre `http://localhost:4400`. Para consultar los logs:

```bash
docker compose logs -f react-dev
```

Para detener el contenedor:

```bash
make stop
```

También pueden utilizarse los comandos equivalentes del `Makefile`:

```bash
make build
make up
make stop
make reup
```

### Producción

La imagen de producción compila el proyecto y sirve `dist/` mediante Nginx. La configuración incluye fallback a `index.html` para las rutas del frontend.

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Abre `http://localhost:4300`. Para detener el servicio:

```bash
docker compose -f docker-compose.prod.yml stop
```

O utiliza:

```bash
make up-prod
make stop-prod
```

## Solución de problemas

- Si el navegador muestra errores de conexión, confirma que el backend está activo en el puerto `8008`.
- Si aparecen errores CORS, agrega el origen del frontend (`http://localhost:5173` o `http://localhost:4400`) a la configuración del backend.
- Si el puerto `4400`, `4300`, `5173` u `8008` está ocupado, libera el puerto o actualiza la configuración correspondiente.
- Si cambias `package.json`, vuelve a construir la imagen con `docker compose build`.
