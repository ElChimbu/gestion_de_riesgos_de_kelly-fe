# Configuración de Firebase

## Pasos para configurar Firebase:

### 1. Crear proyecto en Firebase Console
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita Authentication en la sección "Authentication" del menú lateral

### 2. Configurar Google como proveedor de autenticación
1. En la sección Authentication, ve a "Sign-in method"
2. Habilita "Google" como proveedor
3. Configura el nombre del proyecto y el dominio autorizado

### 3. Obtener configuración de Firebase
1. Ve a la configuración del proyecto (ícono de engranaje)
2. Selecciona "Project settings"
3. En la sección "Your apps", crea una nueva app web
4. Copia la configuración que aparece

### 4. Actualizar configuración en el código
Reemplaza la configuración en `src/config/firebase.ts` con tus credenciales:

```typescript
const firebaseConfig = {
  apiKey: "TU_API_KEY_REAL",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_MESSAGING_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 5. Configurar dominios autorizados
En Firebase Console > Authentication > Settings > Authorized domains, agrega:
- `localhost` (para desarrollo)
- Tu dominio de producción

## Información para el Backend

Cuando un usuario se autentica con Google, Firebase proporciona un token JWT que puedes enviar al backend para verificar la autenticación. El token se puede obtener así:

```typescript
import { auth } from './config/firebase';

// Obtener el token del usuario actual
const token = await auth.currentUser?.getIdToken();

// Enviar el token al backend en el header Authorization
const response = await fetch('/api/protected-endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

El backend deberá verificar este token usando la SDK de Firebase Admin o las claves públicas de Firebase. 