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
      const errorText = await response.text();
      let errorData = null;
      try {
        errorData = JSON.parse(errorText);
      } catch (parseError: unknown) {
        // If the response isn't valid JSON, use the text directly
        throw new Error(
          `API request failed with status ${response.status}: ${errorText.slice(0, 100)}`
        );
      }
      throw new Error(
        errorData?.message || `API request failed with status ${response.status}`
      );
    }

    // Special handling for change password endpoint which returns text response
    if (endpoint.includes('change-password') || endpoint.includes('forgot-password') || endpoint.includes('reset-password')) {
      const responseText = await response.text();
      // Return a success object for password change or forgot password
      return { success: true, message: responseText } as unknown as T;
    }

    // Parse response as JSON for all other endpoints
    const responseText = await response.text();
    // If response is empty, return an empty object
    if (!responseText.trim()) {
      return {} as T;
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError: unknown) {
      console.log('JSON Parse error:', parseError, 'Response text:', responseText.slice(0, 100));
      throw new Error(`Failed to parse response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }
    return result as T;
  } catch (error) {
    console.log('API request error:', error);
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