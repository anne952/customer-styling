import { apiRequest, getStoredToken, setStoredToken } from './api';

export interface User {
  id: number;
  email: string;
  nom: string;
  role: 'client' | 'vendeur' | 'admin';
  photoProfil?: string;
  localisation?: string;
  telephone?: string;
  typeCouture?: string[];
  commentaire?: string;
  specialite?: string[];
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  nom: string;
  localisation: string;
  telephone: string;
  role?: 'client';
}



export async function register(data: RegisterData): Promise<{ user: User; token: string }> {
  console.log('[REGISTER] Starting registration with data:', data);
  try {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[REGISTER] Registration successful, response:', response.data);

    if (response.data.token) {
      console.log('[REGISTER] Storing token:', response.data.token);
      await setStoredToken(response.data.token);
    } else {
      console.warn('[REGISTER] No token received in response');
    }

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error) {
    console.error('[REGISTER] Registration failed:', error);
    throw error;
  }
}

export async function login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
  console.log('[LOGIN] Starting login with credentials:', { email: credentials.email, password: credentials.password ? '[HIDDEN]' : '' });
  try {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[LOGIN] Login successful, response user:', response.data.user);

    if (response.data.token) {
      console.log('[LOGIN] Storing token');
      await setStoredToken(response.data.token);
    } else {
      console.warn('[LOGIN] No token received in response');
    }

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error) {
    console.error('[LOGIN] Login failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {
    await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  } catch (error) {
    // Even if logout request fails, we should clear local token
    console.warn('Logout request failed:', error);
  } finally {
    await setStoredToken(null);
  }
}

export async function getCurrentUser(): Promise<User> {
  try {
    const response = await apiRequest('/api/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
}



export async function isAuthenticated(): Promise<boolean> {
  const token = await getStoredToken();
  return !!token;
}

export async function getCurrentUserRole(): Promise<'client' | 'vendeur' | 'admin' | null> {
  try {
    const user = await getCurrentUser();
    return user.role;
  } catch (error) {
    return null;
  }
}

export async function updateUser(data: Partial<User>): Promise<User> {
  console.log('[UPDATE USER] Starting user update with data:', data);
  try {
    // Use the existing PUT /api/users/me endpoint for general profile updates
    const response = await apiRequest('/api/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('[UPDATE USER] Update successful, response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[UPDATE USER] Update failed:', error);
    throw error;
  }
}

export async function uploadImage(uri: string): Promise<string> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary configuration missing');
  }

  const data = new FormData();
  data.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  } as any);
  data.append('upload_preset', uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: data,
  });

  const result = await response.json();
  if (response.ok) {
    return result.secure_url;
  } else {
    throw new Error(result.error?.message || 'Upload failed');
  }
}

export async function getUserById(id: number): Promise<User> {
  console.log('[GET USER BY ID] Getting user:', id);
  try {
    // Utiliser la nouvelle route publique pour les vendeurs
    const response = await apiRequest(`/api/users/vendeur/${id}`);
    console.log('[GET USER BY ID] User data:', response.data);
    return response.data;
  } catch (error) {
    console.error('[GET USER BY ID] Failed:', error);
    throw error;
  }
}

export async function searchUsers(query: string): Promise<User[]> {
  console.log('[SEARCH USERS] Searching for:', query);
  try {
    // Pour l'instant, charger quelques vendeurs potentiels via les produits
    // Note: Dans un vrai backend, il faudrait un endpoint dédié
    return []; // Désactiver recherche vendeurs si endpoint non disponible
  } catch (error) {
    console.error('[SEARCH USERS] Failed:', error);
    return [];
  }
}
