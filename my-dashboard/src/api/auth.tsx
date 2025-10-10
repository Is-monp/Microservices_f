//  Manejo de autenticación con re-login automático

let cachedCredentials: { email: string; password: string } | null = null;

/**
 * Guarda las credenciales del usuario (solo en memoria, no localStorage)
 */
export function saveCredentials(email: string, password: string) {
  cachedCredentials = { email, password };
}

/**
 * Hace un fetch autenticado con autorefresco de token
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem('accessToken');

  // Si no hay token, forzar login
  if (!token) {
    console.warn('No hay token, redirigiendo al login...');
    handleSessionExpired();
    throw new Error('No token');
  }

  const headers = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  try {
    const response = await fetch(url, { ...options, headers });

    // Si el token expiró o perdió validez
    if (response.status === 401 || response.status === 403) {
      console.warn(' Token expirado, intentando reautenticación...');
      const newToken = await tryRelogin();

      if (!newToken) {
        console.error(' No se pudo refrescar el token. Cerrando sesión.');
        handleSessionExpired();
        throw new Error('Fallo en refrescar token');
      }

      // Reintentar la solicitud original con el nuevo token
      const retryHeaders = {
        ...(options.headers || {}),
        Authorization: `Bearer ${newToken}`,
      };

      return await fetch(url, { ...options, headers: retryHeaders });
    }

    return response;
  } catch (error) {
    console.error('Error en authenticatedFetch:', error);
    throw error;
  }
}

/**
 * Intenta reautenticar usando las credenciales guardadas
 */
async function tryRelogin(): Promise<string | null> {
  if (!cachedCredentials) {
    console.warn('No hay credenciales guardadas para reautenticación.');
    return null;
  }

  console.log(' Intentando reautenticación automática...');
  const API_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: cachedCredentials.email,
        password: cachedCredentials.password,
      }),
    });

    if (!res.ok) {
      console.error(` Falló el refresh: ${res.status}`);
      return null;
    }

    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);

    console.log('Nuevo token obtenido automáticamente.');
    return data.accessToken;
  } catch (e) {
    console.error('Error al reautenticar:', e);
    return null;
  }
}

/**
 * Limpia la sesión y redirige al login
 */
function handleSessionExpired() {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
  window.location.href = '/login';
}
