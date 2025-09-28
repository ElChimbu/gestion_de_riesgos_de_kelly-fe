# Configuración de Autenticación para el Backend

## Información que necesitas enviar al backend:

### 1. Configuración de Firebase
El backend necesitará configurar Firebase Admin SDK para verificar los tokens JWT que envía el frontend.

### 2. Headers de Autenticación
El frontend ahora envía automáticamente el token de Firebase en el header `Authorization` con el formato:
```
Authorization: Bearer <firebase_jwt_token>
```

### 3. Verificación de Tokens en el Backend

#### Para Node.js/Express:
```javascript
const admin = require('firebase-admin');

// Inicializar Firebase Admin
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  // O usar service account key:
  // credential: admin.credential.cert(require('./path/to/serviceAccountKey.json'))
});

// Middleware para verificar tokens
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verificando token:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Usar en las rutas protegidas
app.get('/api/operations', authenticateToken, (req, res) => {
  // req.user contiene la información del usuario autenticado
  const userId = req.user.uid;
  const userEmail = req.user.email;
  // ... lógica de la API
});
```

#### Para Python/FastAPI:
```python
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Inicializar Firebase Admin
cred = credentials.Certificate("path/to/serviceAccountKey.json")
firebase_admin.initialize_app(cred)

security = HTTPBearer()

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        decoded_token = auth.verify_id_token(credentials.credentials)
        return decoded_token
    except Exception as e:
        raise HTTPException(status_code=403, detail="Token inválido")

# Usar en las rutas protegidas
@app.get("/api/operations")
async def get_operations(user: dict = Depends(verify_token)):
    user_id = user['uid']
    user_email = user['email']
    # ... lógica de la API
```

### 4. Información del Usuario Disponible
Cuando verificas un token de Firebase, obtienes información como:
- `uid`: ID único del usuario
- `email`: Email del usuario
- `email_verified`: Si el email está verificado
- `name`: Nombre del usuario (si está disponible)
- `picture`: URL de la foto de perfil (si está disponible)

### 5. Configuración de Firebase Admin
El backend necesitará:
1. **Service Account Key**: Descargar desde Firebase Console > Project Settings > Service Accounts
2. **Firebase Admin SDK**: Instalar la librería correspondiente para tu lenguaje

### 6. Variables de Entorno Recomendadas
```env
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tu-project.iam.gserviceaccount.com
```

### 7. Ejemplo de Middleware Completo (Node.js)
```javascript
const express = require('express');
const admin = require('firebase-admin');

const app = express();

// Middleware de autenticación
const requireAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    return res.status(403).json({ error: 'Token inválido' });
  }
};

// Aplicar a todas las rutas de la API
app.use('/api', requireAuth);

// Rutas protegidas
app.get('/api/operations', async (req, res) => {
  const userId = req.user.uid;
  // Tu lógica aquí
});
```

### 8. Consideraciones de Seguridad
- Siempre verifica los tokens en el backend
- No confíes solo en la autenticación del frontend
- Usa HTTPS en producción
- Considera implementar rate limiting por usuario
- Valida que el usuario tenga permisos para acceder a los recursos 