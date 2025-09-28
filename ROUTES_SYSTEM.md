# Sistema de Rutas - Públicas y Privadas

## Estructura del Sistema de Autenticación

### **Rutas Públicas** (`/src/Routes/PublicRoutes.tsx`)
- **Acceso**: Sin autenticación requerida
- **Rutas**:
  - `/login` - Página de login con Google

### **Rutas Privadas** (`/src/Routes/PrivateRoutes.tsx`)
- **Acceso**: Requiere autenticación
- **Protección**: Automática con `ProtectedRoute`
- **Layout**: Incluye `PrivateLayout` con navegación
- **Rutas**:
  - `/` - Página principal (Operaciones)
  - `/fixed-operations` - Operaciones de riesgo fijo

## Flujo de Autenticación

### **1. Usuario no autenticado:**
```
Usuario visita cualquier ruta → AuthRedirect → Redirige a /login
```

### **2. Usuario autenticado:**
```
Usuario visita /login → AuthRedirect → Redirige a /
```

### **3. Acceso a rutas privadas:**
```
Usuario autenticado → ProtectedRoute → PrivateLayout → Contenido
```

## Componentes Clave

### **AuthRedirect**
- Verifica el estado de autenticación
- Redirige automáticamente según el estado
- Se ejecuta en todas las rutas

### **ProtectedRoute**
- Protege rutas que requieren autenticación
- Muestra loading mientras verifica
- Redirige al login si no hay usuario

### **PrivateLayout**
- Layout común para páginas privadas
- Incluye header con navegación
- Muestra información del usuario
- Botón de logout

## Configuración de Firebase

### **Dominios Autorizados**
En Firebase Console > Authentication > Settings > Authorized domains:
- `localhost` (desarrollo)
- Tu dominio de producción

### **Proveedores Habilitados**
- Google (único proveedor configurado)

## Estructura de Archivos

```
src/
├── Routes/
│   ├── index.tsx          # Exporta rutas públicas y privadas
│   ├── PublicRoutes.tsx   # Rutas sin autenticación
│   └── PrivateRoutes.tsx  # Rutas con autenticación
├── components/
│   ├── ProtectedRoute.tsx # Protege rutas privadas
│   ├── PrivateLayout.tsx  # Layout para páginas privadas
│   └── AuthRedirect.tsx   # Redirige según autenticación
└── hooks/
    ├── AuthContext.tsx    # Contexto de autenticación
    └── RouteManager.tsx   # Maneja todas las rutas
```

## Uso del Sistema

### **Agregar Nueva Ruta Pública:**
```typescript
// En PublicRoutes.tsx
export const PublicRoutes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/nueva-ruta-publica",
    component: NuevaRutaPublica,
  },
];
```

### **Agregar Nueva Ruta Privada:**
```typescript
// En PrivateRoutes.tsx
export const PrivateRoutes = [
  {
    path: "/",
    component: () => (
      <ProtectedRoute>
        <PrivateLayout>
          <Home />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
  {
    path: "/nueva-ruta-privada",
    component: () => (
      <ProtectedRoute>
        <PrivateLayout>
          <NuevaRutaPrivada />
        </PrivateLayout>
      </ProtectedRoute>
    ),
  },
];
```

## Características del Sistema

✅ **Redirección automática** al login si no hay autenticación  
✅ **Protección de rutas** con componente dedicado  
✅ **Layout consistente** para páginas privadas  
✅ **Navegación integrada** con información del usuario  
✅ **Logout funcional** que redirige al login  
✅ **Loading states** durante verificación de autenticación  
✅ **Separación clara** entre rutas públicas y privadas 