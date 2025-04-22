export const API_URL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    CHANGE_PASSWORD: '/auth/my-profile/change-password',
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
  PRODUCTS: {
    BASE: '/products',
    FAVORITE: '/products/favorite',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
  },
  DOCTORS: {
    BASE: '/doctors',
  },
  CATEGORIES: {
    BASE: '/categories',
  },
  ORDERS: {
    BASE: '/orders',
  },
  MEDICAL_RECORDS: {
    BASE: '/medical-records',
  },
  NOTIFICATIONS: {
    BASE: '/notifications',
  },
};