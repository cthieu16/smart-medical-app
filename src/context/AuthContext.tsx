import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";
import { API_URL, ENDPOINTS } from "../constants/api";
import { AuthContextType, FacebookUser, GoogleUser, User } from "../types";
import { clearAuthData, getData, storeAuthData, storeData, STORAGE_KEYS } from "../utils/storage";
import { get, post } from "../utils/api";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: accessToken } = useQuery<string | null>({
    queryKey: ["accessToken"],
    queryFn: () => getData(STORAGE_KEYS.ACCESS_TOKEN),
  });

  const { data: googleUser } = useQuery<GoogleUser | null>({
    queryKey: ["googleUser"],
    queryFn: async () => getData(STORAGE_KEYS.GOOGLE_USER),
  });

  const { data: facebookUser } = useQuery<FacebookUser | null>({
    queryKey: ["facebookUser"],
    queryFn: async () => getData(STORAGE_KEYS.FACEBOOK_USER),
  });

  const { data: user } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!accessToken) return null;
      return get<User>(ENDPOINTS.AUTH.ME);
    },
    enabled: !!accessToken,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      const response = await post<{ accessToken: string }>(
        ENDPOINTS.AUTH.LOGIN,
        { username, password },
        false
      );
      await storeAuthData(response.accessToken);
      return response.accessToken;
    },
    onSuccess: (authToken) => {
      queryClient.setQueryData(["accessToken"], authToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      try {
        // Gọi API logout nếu có access token
        if (accessToken) {
          try {
            await post(ENDPOINTS.AUTH.LOGOUT, {});
          } catch (error) {
            console.error("Error during API logout:", error);
            // Tiếp tục xử lý kể cả khi API fail
          }
        }

        // Luôn xóa dữ liệu local dù API có thành công hay không
        await clearAuthData();

        // Reset tất cả queries để tránh cache
        queryClient.clear();

        return true;
      } catch (error) {
        console.error("Failed to logout:", error);
        // Force xóa dữ liệu nếu có lỗi
        await clearAuthData();
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["accessToken"], null);
      queryClient.setQueryData(["user"], null);
      queryClient.setQueryData(["googleUser"], null);
      queryClient.setQueryData(["facebookUser"], null);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      fullName,
      email,
      username,
      password,
      confirmPassword,
    }: {
      fullName: string;
      email: string;
      username: string;
      password: string;
      confirmPassword: string;
    }) => {
      await post(ENDPOINTS.AUTH.REGISTER, {
        fullName,
        email,
        username,
        password,
        confirmPassword,
      }, false);

      await loginMutation.mutateAsync({ username, password });
    },
  });

  const authenticateWithGoogleMutation = useMutation({
    mutationFn: async (googleToken: string) => {
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${googleToken}` },
        }
      );

      if (!userInfoResponse.ok) {
        throw new Error("Error al obtener información del usuario de Google");
      }

      const userInfo: GoogleUser = await userInfoResponse.json();
      await storeData(STORAGE_KEYS.GOOGLE_USER, userInfo);

      // Authenticate with backend
      const response = await post<{ accessToken: string }>(
        ENDPOINTS.AUTH.LOGIN,
        {
          googleId: userInfo.id,
          email: userInfo.email,
          fullName: userInfo.name,
        },
        false
      );

      await storeAuthData(response.accessToken);
      return response.accessToken;
    },
    onSuccess: (authToken) => {
      queryClient.setQueryData(["accessToken"], authToken);
      queryClient.invalidateQueries({ queryKey: ["googleUser"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const authenticateWithFacebookMutation = useMutation({
    mutationFn: async (facebookToken: string) => {
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?fields=id,first_name,last_name,email,picture&access_token=${facebookToken}`
      );

      if (!userInfoResponse.ok) {
        throw new Error(
          "Error al obtener información del usuario de Facebook"
        );
      }

      const userInfo: FacebookUser = await userInfoResponse.json();
      await storeData(STORAGE_KEYS.FACEBOOK_USER, userInfo);

      // Authenticate with backend
      const response = await post<{ accessToken: string }>(
        ENDPOINTS.AUTH.LOGIN,
        {
          facebookId: userInfo.id,
          email: userInfo.email,
          fullName: `${userInfo.first_name} ${userInfo.last_name}`,
        },
        false
      );

      await storeAuthData(response.accessToken);
      return response.accessToken;
    },
    onSuccess: (authToken) => {
      queryClient.setQueryData(["accessToken"], authToken);
      queryClient.invalidateQueries({ queryKey: ["facebookUser"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      await post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email }, false);
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
      newPasswordConfirm,
    }: {
      currentPassword: string;
      newPassword: string;
      newPasswordConfirm: string;
    }) => {
      await post(ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
        newPasswordConfirm,
      });
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error("Logout failed:", error);
      // Trong trường hợp xảy ra lỗi, vẫn đảm bảo dữ liệu local được xóa
      await clearAuthData();
    }
  };

  const register = async (
    fullName: string,
    email: string,
    username: string,
    password: string,
    confirmPassword: string
  ) => {
    await registerMutation.mutateAsync({
      fullName,
      email,
      username,
      password,
      confirmPassword,
    });
  };

  const authenticateWithGoogle = async (token: string) => {
    await authenticateWithGoogleMutation.mutateAsync(token);
  };

  const authenticateWithFacebook = async (token: string) => {
    await authenticateWithFacebookMutation.mutateAsync(token);
  };

  const forgotPassword = async (email: string) => {
    await forgotPasswordMutation.mutateAsync(email);
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    newPasswordConfirm: string
  ) => {
    await changePasswordMutation.mutateAsync({
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        accessToken: accessToken ?? null,
        googleUser: googleUser ?? null,
        facebookUser: facebookUser ?? null,
        login,
        logout,
        register,
        authenticateWithGoogle,
        authenticateWithFacebook,
        forgotPassword,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
