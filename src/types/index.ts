// User types
export type User = {
  fullName: string | null;
  email: string;
  username: string;
};

export type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

export type FacebookUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
};

// Route types
export type AppRoutes = "/register" | "/login";

// Auth types
export type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  googleUser: GoogleUser | null;
  facebookUser: FacebookUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    fullName: string,
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => Promise<void>;
  authenticateWithGoogle: (accessToken: string) => Promise<void>;
  authenticateWithFacebook: (accessToken: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ) => Promise<void>;
};