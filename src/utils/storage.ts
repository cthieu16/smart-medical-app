import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@accessToken',
  USER: '@user',
  GOOGLE_USER: '@googleUser',
  FACEBOOK_USER: '@facebookUser',
  FAVORITES: '@favorites',
};

// Generic storage functions
export const storeData = async (key: string, value: any): Promise<void> => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
  }
};

export const getData = async (key: string): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch {
        return value; // Return as is if not JSON
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
  }
};

export const clearAll = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Specific storage functions for auth
export const storeAuthData = async (token: string): Promise<void> => {
  await storeData(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getAuthToken = async (): Promise<string | null> => {
  return getData(STORAGE_KEYS.ACCESS_TOKEN);
};

export const clearAuthData = async (): Promise<void> => {
  await Promise.all([
    removeData(STORAGE_KEYS.ACCESS_TOKEN),
    removeData(STORAGE_KEYS.USER),
    removeData(STORAGE_KEYS.GOOGLE_USER),
    removeData(STORAGE_KEYS.FACEBOOK_USER),
  ]);
}; 