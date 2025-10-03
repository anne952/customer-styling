import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://backend-x-stylings.onrender.com';
console.log('[API CONFIG] Base URL:', API_BASE_URL);
console.log('[API CONFIG] Environment variables:', process.env);

interface ApiResponse<T = any> {
  message?: string;
  user?: T;
  token?: string;
  data?: T;
  errors?: any;
}

class ApiError extends Error {
  constructor(message: string, public status: number, public errors?: any) {
    super(message);
    this.name = 'ApiError';
  }
}

async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = await getStoredToken();
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    console.log('[API REQUEST]', config.method || 'GET', url);
    if (config.body) {
      console.log('[API REQUEST BODY]', config.body);
    }

    const response = await fetch(url, config);
    console.log('[API RESPONSE STATUS]', response.status, response.url);

    const data = await response.json();
    console.log('[API RESPONSE DATA]', data);

    if (!response.ok) {
      console.error('[API ERROR]', response.status, data);
      throw new ApiError(
        data.message || 'Une erreur est survenue',
        response.status,
        data.errors
      );
    }

    return data;
  } catch (error) {
    console.error('[API NETWORK ERROR]', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erreur de réseau', 0);
  }
}

async function getStoredToken(): Promise<string | null> {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
}

async function setStoredToken(token: string | null): Promise<void> {
  try {
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    } else {
      await AsyncStorage.removeItem('authToken');
    }
  } catch (error) {
    console.error('Error storing token:', error);
  }
}

export async function toggleLike(produitId: number): Promise<boolean> {
  const response = await apiRequest('/api/likes', {
    method: 'POST',
    body: JSON.stringify({ produitId }),
  });
  return response.liked;
}

export async function getProductById(id: number): Promise<any> {
  return apiRequest(`/api/products/${id}`);
}

export async function getUserLikes(): Promise<any[]> {
  return apiRequest('/api/likes');
}

export { apiRequest, ApiError, getStoredToken, setStoredToken };
export type { ApiResponse };
