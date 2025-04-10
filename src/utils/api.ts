import { API_URL } from '../constants/api';
import { getAuthToken } from './storage';

// HTTP request methods
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Base API request function
const apiRequest = async <T>(
  endpoint: string,
  method: HttpMethod = 'GET',
  data?: any,
  requiresAuth: boolean = true
): Promise<T> => {
  try {
    const url = `${API_URL}${endpoint}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add authorization header if required
    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        throw new Error('Authentication required but no token available');
      }
    }

    const options: RequestInit = {
      method,
      headers,
    };

    // Add request body if needed
    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);

    // Handle API errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        errorData?.message || `API request failed with status ${response.status}`
      );
    }

    // Parse response as JSON
    const result = await response.json();
    return result as T;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Convenience methods
export const get = <T>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<T> => {
  return apiRequest<T>(endpoint, 'GET', undefined, requiresAuth);
};

export const post = <T>(
  endpoint: string,
  data: any,
  requiresAuth: boolean = true
): Promise<T> => {
  return apiRequest<T>(endpoint, 'POST', data, requiresAuth);
};

export const put = <T>(
  endpoint: string,
  data: any,
  requiresAuth: boolean = true
): Promise<T> => {
  return apiRequest<T>(endpoint, 'PUT', data, requiresAuth);
};

export const patch = <T>(
  endpoint: string,
  data: any,
  requiresAuth: boolean = true
): Promise<T> => {
  return apiRequest<T>(endpoint, 'PATCH', data, requiresAuth);
};

export const del = <T>(
  endpoint: string,
  requiresAuth: boolean = true
): Promise<T> => {
  return apiRequest<T>(endpoint, 'DELETE', undefined, requiresAuth);
}; 