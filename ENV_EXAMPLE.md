# Variables de Entorno - Frontend

## Archivo .env (crear en la raíz del proyecto)

```env
# URL de la API del backend
VITE_API_URL=http://localhost:3000/api

# Configuración de Firebase (opcional, ya está en el código)
# VITE_FIREBASE_API_KEY=AIzaSyDOtFNiiTQBx8Q1uG9BuY-0Rl6wXNX15Ko
# VITE_FIREBASE_AUTH_DOMAIN=misfinanzascrypto.firebaseapp.com
# VITE_FIREBASE_PROJECT_ID=misfinanzascrypto
# VITE_FIREBASE_STORAGE_BUCKET=misfinanzascrypto.firebasestorage.app
# VITE_FIREBASE_MESSAGING_SENDER_ID=125737034568
# VITE_FIREBASE_APP_ID=1:125737034568:web:c5585b73dc5eb94e15497d
# VITE_FIREBASE_MEASUREMENT_ID=G-8FV6R7RX59
```

## Variables de Entorno - Backend

```env
# Firebase Admin SDK
FIREBASE_PROJECT_ID=misfinanzascrypto
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@misfinanzascrypto.iam.gserviceaccount.com

# Base de datos Neon
DATABASE_URL=postgresql://user:password@host:port/database

# Puerto del servidor
PORT=3000
``` 