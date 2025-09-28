# Configuración Firebase Console - Pasos Específicos

## 🔧 **Paso 1: Habilitar Google como Proveedor**

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto **"misfinanzascrypto"**
3. En el menú lateral, ve a **Authentication**
4. Haz clic en **Sign-in method**
5. Busca **Google** en la lista y haz clic en él
6. Cambia el toggle a **Enabled**
7. En **Project support email**, selecciona tu email
8. Haz clic en **Save**

## 🔧 **Paso 2: Configurar Dominios Autorizados**

1. En la misma sección **Authentication**
2. Ve a la pestaña **Settings**
3. Busca la sección **Authorized domains**
4. Haz clic en **Add domain**
5. Agrega: `localhost`
6. Haz clic en **Add**

## 🔧 **Paso 3: Verificar Configuración del Proyecto**

1. Ve a **Project settings** (ícono de engranaje)
2. Verifica que el **Project ID** sea: `misfinanzascrypto`
3. En la sección **Your apps**, debería aparecer tu app web
4. Si no hay app web, crea una nueva:
   - Haz clic en **Add app** > **Web**
   - Dale un nombre como "Kelly Risk Web"
   - Registra la app

## 🧪 **Paso 4: Probar la Configuración**

1. Regresa a tu aplicación: `http://localhost:5174/login`
2. Abre las **DevTools** (F12)
3. Ve a la pestaña **Console**
4. Intenta hacer login con Google
5. Verifica los mensajes en la consola:
   - "Attempting Google sign in..."
   - "Sign in successful: [email]"
   - O mensajes de error específicos

## 🚨 **Errores Comunes y Soluciones**

### **Error: "unauthorized-domain"**
- **Solución**: Asegúrate de que `localhost` esté en dominios autorizados
- **Verificar**: Authentication > Settings > Authorized domains

### **Error: "popup-closed-by-user"**
- **Solución**: El usuario cerró la ventana
- **Prevención**: Permite popups para localhost:5174

### **Error: "popup-blocked"**
- **Solución**: 
  1. En Chrome, haz clic en el ícono de candado en la URL
  2. Permite popups para este sitio
  3. O agrega `localhost:5174` a las excepciones

### **Error: "network-request-failed"**
- **Solución**: Verifica tu conexión a internet
- **Alternativa**: Intenta con una conexión diferente

## 📋 **Checklist de Verificación**

- [ ] Google habilitado como proveedor
- [ ] `localhost` agregado a dominios autorizados
- [ ] Project ID correcto: `misfinanzascrypto`
- [ ] App web registrada en Firebase
- [ ] Popups permitidos en el navegador
- [ ] Conexión a internet estable

## 🔍 **Debugging**

### **Verificar en Console:**
```javascript
// En DevTools Console, ejecuta:
console.log('Firebase config:', {
  projectId: 'misfinanzascrypto',
  authDomain: 'misfinanzascrypto.firebaseapp.com'
});
```

### **Verificar Estado de Auth:**
```javascript
// En DevTools Console, ejecuta:
import { auth } from './src/config/firebase';
console.log('Current user:', auth.currentUser);
```

## 🎯 **Resultado Esperado**

Después de configurar correctamente:
1. ✅ El popup de Google se abre
2. ✅ Puedes seleccionar tu cuenta
3. ✅ El popup se cierra automáticamente
4. ✅ Te redirige a la página principal
5. ✅ Ves tu información de usuario en el header

**¡Si sigues estos pasos exactamente, debería funcionar!** 