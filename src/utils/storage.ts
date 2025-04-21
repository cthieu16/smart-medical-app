import AsyncStorage from "@react-native-async-storage/async-storage";

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: '@accessToken',
  USER: '@user',
  GOOGLE_USER: '@googleUser',
  FACEBOOK_USER: '@facebookUser',
  FAVORITES: '@favorites',
  NOTIFICATIONS: '@notifications',
  APP_SETTINGS: '@appSettings',
  RECENT_SEARCHES: '@recentSearches',
  CACHE_DATA: '@cacheData',
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
    console.log('All storage cleared successfully');
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
  try {
    // Thay vì xóa từng key riêng lẻ, xóa toàn bộ AsyncStorage để đảm bảo không còn dữ liệu nào
    await clearAll();
    console.log('Auth data and all local storage cleared successfully');
  } catch (error) {
    console.error('Error clearing auth data:', error);
    // Fallback approach: try to remove individual keys if clearing all fails
    await Promise.all([
      removeData(STORAGE_KEYS.ACCESS_TOKEN),
      removeData(STORAGE_KEYS.USER),
      removeData(STORAGE_KEYS.GOOGLE_USER),
      removeData(STORAGE_KEYS.FACEBOOK_USER),
      removeData(STORAGE_KEYS.FAVORITES),
      removeData(STORAGE_KEYS.NOTIFICATIONS),
      removeData(STORAGE_KEYS.APP_SETTINGS),
      removeData(STORAGE_KEYS.RECENT_SEARCHES),
      removeData(STORAGE_KEYS.CACHE_DATA),
    ]);
  }
};