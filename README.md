# Gestión de Riesgos - Método de Kelly
Aplicación de gestión de riesgos financieros construida con **React**, **Tailwind CSS v4** y **Vite**.

## Instalación

```bash
npm install
```

## Ejecutar
```bash
npm run dev
```

## Variables de Entorno

Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```env
# Configuración de la API
VITE_API_URL=/api
```

### Explicación de las Variables de Entorno:

- **VITE_API_URL**: URL base de la API. 
  - Para desarrollo local: `/api` (relativo al frontend)
  - Para producción: `https://your-api.vercel.app/api` (URL completa)
  - Si no se define, usa `/api` por defecto

## Endpoints de la API

La aplicación utiliza los siguientes endpoints de la API:

- `GET /api/operations` - Obtener todas las operaciones
- `POST /api/operations` - Crear una operación
- `PUT /api/operations/[id]` - Actualizar una operación
- `DELETE /api/operations/[id]` - Eliminar una operación
- `DELETE /api/operations` - Eliminar todas las operaciones
- `POST /api/upload` - Subir archivos

## Construcción de CSS
```bash
npm run build:css
```
