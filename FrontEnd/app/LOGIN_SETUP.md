# Configuración del Sistema de Login

## ✅ Componentes Implementados

Se ha implementado un sistema completo de login con las siguientes características:

### Componentes Creados:
1. **AuthContext** (`src/context/AuthContext.js`)
   - Maneja el estado de autenticación global
   - Funciones: login, logout, loginWithGoogle
   - Control del modal de login

2. **LoginModal** (`src/components/LoginModal.js`)
   - Modal con formulario de login/registro
   - Integración con Google Sign-In
   - Tabs para alternar entre Login y Sign Up
   - Diseño responsive adaptado al tema dark

3. **LoginButton** (`src/components/LoginButton.js`)
   - Botón en la barra de navegación
   - Muestra perfil de usuario cuando está logueado
   - Botón de logout

### Archivos Modificados:
- `src/App.js` - Agregados providers (GoogleOAuthProvider, AuthProvider)
- `src/components/NavBar.js` - Agregado LoginButton
- `package.json` - Instaladas dependencias

---

## 🔧 Configuración de Google OAuth

Para que funcione el login con Google, necesitas obtener un Client ID:

### Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. En el menú lateral, ve a "APIs y servicios" > "Credenciales"

### Paso 2: Configurar la Pantalla de Consentimiento OAuth

1. Click en "Pantalla de consentimiento de OAuth"
2. Selecciona "Externo" (o "Interno" si es para una organización)
3. Completa la información requerida:
   - Nombre de la aplicación
   - Correo electrónico de soporte
   - Logo (opcional)
4. Guarda y continúa

### Paso 3: Crear Credenciales OAuth 2.0

1. Ve a "Credenciales" > "Crear credenciales" > "ID de cliente de OAuth 2.0"
2. Tipo de aplicación: **Aplicación web**
3. Nombre: "Login App" (o el que prefieras)
4. **Orígenes de JavaScript autorizados:**
   - `http://localhost:3000` (para desarrollo)
   - Tu dominio de producción cuando lo tengas
5. **URIs de redirección autorizados:**
   - `http://localhost:3000` (para desarrollo)
6. Click en "Crear"
7. **Copia el Client ID** que se genera

### Paso 4: Configurar el Client ID en la Aplicación

1. Abre el archivo `src/App.js`
2. Busca la línea:
   ```javascript
   <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID_HERE">
   ```
3. Reemplaza `"YOUR_GOOGLE_CLIENT_ID_HERE"` con tu Client ID real:
   ```javascript
   <GoogleOAuthProvider clientId="123456789-abcdefghijklmnop.apps.googleusercontent.com">
   ```

---

## 🚀 Cómo Usar el Sistema de Login

### Para Usuarios:

1. **Abrir el Modal de Login:**
   - Click en el botón "Iniciar Sesión" en la barra de navegación

2. **Login Tradicional:**
   - Ingresa email y contraseña
   - Click en "Iniciar Sesión"
   - (Nota: Por ahora solo es UI, se conectará al backend después)

3. **Login con Google:**
   - Click en el botón "Continuar con Google"
   - Selecciona tu cuenta de Google
   - Autoriza la aplicación

4. **Registro:**
   - Click en la tab "Sign Up"
   - Ingresa nombre, email y contraseña
   - Click en "Crear Cuenta"

5. **Cerrar Sesión:**
   - Una vez logueado, aparecerá tu nombre en la barra de navegación
   - Click en el botón "Salir"

---

## 🔌 Conexión con Backend (Próximos Pasos)

El sistema está preparado para conectarse con un backend. Los puntos de integración son:

### En `src/context/AuthContext.js`:

```javascript
// Función login - línea ~17
const login = (userData) => {
  setUser(userData);
  setIsLoginModalOpen(false);
  // TODO: Aquí agregar llamada al backend
  // Ejemplo:
  // const response = await fetch('/api/login', {
  //   method: 'POST',
  //   body: JSON.stringify(userData)
  // });
};

// Función loginWithGoogle - línea ~24
const loginWithGoogle = (credentialResponse) => {
  // TODO: Enviar credentialResponse.credential al backend
  // Ejemplo:
  // const response = await fetch('/api/auth/google', {
  //   method: 'POST',
  //   body: JSON.stringify({ token: credentialResponse.credential })
  // });
};

// Función logout - línea ~38
const logout = () => {
  setUser(null);
  // TODO: Llamar al backend para cerrar sesión
  // Ejemplo:
  // await fetch('/api/logout', { method: 'POST' });
};
```

### Endpoints del Backend Recomendados:

- `POST /api/login` - Login tradicional
- `POST /api/register` - Registro de usuario
- `POST /api/auth/google` - Autenticación con Google
- `POST /api/logout` - Cerrar sesión
- `GET /api/user` - Obtener datos del usuario actual

---

## 🎨 Personalización

### Cambiar Textos:
Edita `src/components/LoginModal.js` para cambiar los textos del formulario.

### Cambiar Estilos:
Los componentes usan styled-components y el tema definido en `src/styles/Themes.js`.

### Agregar Más Proveedores:
Puedes agregar más botones de login social (Facebook, Twitter, etc.) en el LoginModal.

---

## 📝 Notas Importantes

- El sistema actualmente solo maneja la UI
- Los datos de login se guardan en el estado de React (se pierden al recargar)
- Para persistencia, implementa localStorage o conexión con backend
- El Google Client ID debe mantenerse seguro (no compartir públicamente)
- Para producción, agrega tu dominio real a los orígenes autorizados en Google Cloud

---

## 🐛 Troubleshooting

### Error: "Invalid Client ID"
- Verifica que copiaste correctamente el Client ID
- Asegúrate de que el origen esté autorizado en Google Cloud Console

### El botón de Google no aparece
- Verifica que instalaste las dependencias: `npm install`
- Revisa la consola del navegador para errores

### El modal no se abre
- Verifica que AuthProvider esté envolviendo la aplicación en App.js
- Revisa que LoginModal esté importado y renderizado

---

## ✨ Características Implementadas

- ✅ Modal de login/registro con animaciones
- ✅ Formulario tradicional (email/password)
- ✅ Integración con Google OAuth
- ✅ Tabs para alternar entre login y registro
- ✅ Botón de "Olvidaste tu contraseña"
- ✅ Diseño responsive
- ✅ Tema dark adaptado al diseño existente
- ✅ Gestión de estado global con Context API
- ✅ Animaciones con Framer Motion
- ✅ Iconos con React Icons
- ✅ Perfil de usuario en navbar cuando está logueado
- ✅ Botón de logout

---

¡El sistema de login está listo para usar! Solo necesitas configurar el Google Client ID y conectar con tu backend cuando esté listo.
