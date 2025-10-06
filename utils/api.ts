import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://backend-x-stylings.onrender.com';
console.log('[API CONFIG] Base URL:', API_BASE_URL);

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
): Promise<{ status: number; data: T }> {
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
    const response = await fetch(url, config);
    console.log('[API RESPONSE STATUS]', response.status);

    // Try to parse JSON only if content-type is JSON
    const contentType = response.headers.get('content-type') || '';
    let parsedBody: any = null;
    try {
      if (contentType.includes('application/json')) {
        parsedBody = await response.json();
      } else {
        // Fallback to text (e.g., HTML error pages from hosting)
        const textBody = await response.text();
        parsedBody = { message: textBody };
      }
    } catch (parseErr) {
      // Parsing failed (likely HTML or empty). Read as text to include in error context.
      const textBody = await response.text().catch(() => '');
      parsedBody = { message: textBody || 'Réponse non JSON' };
    }

    console.log('[API RESPONSE DATA]', parsedBody);

    if (!response.ok) {
      const message =
        (parsedBody && (parsedBody.message || parsedBody.error)) ||
        `HTTP ${response.status}`;
      console.error('[API ERROR]', response.status, message);
      throw new ApiError(message, response.status, parsedBody?.errors);
    }

    return { status: response.status, data: parsedBody };
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

export async function getProductById(id: number): Promise<any> {
  const result = await apiRequest(`/api/products/${id}`);
  return result.data;
}

export { ApiError, apiRequest, getStoredToken, setStoredToken };
export type { ApiResponse };
