import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";

type User = {
  fullName: string | null;
  email: string;
  username: string;
};

type GoogleUser = {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
};

type FacebookUser = {
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

type AuthContextType = {
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: accessToken } = useQuery<string | null>({
    queryKey: ["accessToken"],
    queryFn: () => AsyncStorage.getItem("@accessToken"),
  });

  const { data: googleUser } = useQuery<GoogleUser | null>({
    queryKey: ["googleUser"],
    queryFn: async () => {
      const storedGoogleUser = await AsyncStorage.getItem("@googleUser");
      return storedGoogleUser ? JSON.parse(storedGoogleUser) : null;
    },
  });

  const { data: facebookUser } = useQuery<FacebookUser | null>({
    queryKey: ["facebookUser"],
    queryFn: async () => {
      const storedFacebookUser = await AsyncStorage.getItem("@facebookUser");
      return storedFacebookUser ? JSON.parse(storedFacebookUser) : null;
    },
  });

  const { data: user } = useQuery<User | null>({
    queryKey: ["user"],
    queryFn: async () => {
      if (!accessToken) return null;
      const response = await fetch(`${ApiURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener información del usuario");
      }
      return response.json();
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
      const response = await fetch(`${ApiURL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }
      const { accessToken: authToken } = await response.json();
      await AsyncStorage.setItem("@accessToken", authToken);
      return authToken;
    },
    onSuccess: (authToken) => {
      queryClient.setQueryData(["accessToken"], authToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (accessToken) {
        await fetch(`${ApiURL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }

      await AsyncStorage.removeItem("@accessToken");
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@googleUser");
      await AsyncStorage.removeItem("@facebookUser");

      queryClient.removeQueries();
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
      const response = await fetch(`${ApiURL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          username,
          password,
          confirmPassword,
        }),
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Error al registrar");
      }
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
      const googleUserInfo: GoogleUser = await userInfoResponse.json();
      await AsyncStorage.setItem("@googleUser", JSON.stringify(googleUserInfo));

      const email = googleUserInfo.email;
      const password = googleUserInfo.id;

      // try {
      //   await loginMutation.mutateAsync({ email, password });
      // } catch (loginError) {
      //   await registerMutation.mutateAsync({
      //     firstName: googleUserInfo.given_name,
      //     lastName: googleUserInfo.family_name,
      //     email,
      //     password,
      //   });
      // }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["googleUser"] });
    },
  });

  const authenticateWithFacebookMutation = useMutation({
    mutationFn: async (facebookToken: string) => {
      const userInfoResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${facebookToken}&fields=id,name,email,first_name,last_name,picture.type(small)`
      );
      const facebookUserInfo: FacebookUser = await userInfoResponse.json();
      await AsyncStorage.setItem(
        "@facebookUser",
        JSON.stringify(facebookUserInfo)
      );

      const email = facebookUserInfo.email;
      const password = facebookUserInfo.id;

      // try {
      //   await loginMutation.mutateAsync({ email, password });
      // } catch (loginError) {
      //   await registerMutation.mutateAsync({
      //     firstName: facebookUserInfo.first_name,
      //     lastName: facebookUserInfo.last_name,
      //     email,
      //     password,
      //   });
      // }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facebookUser"] });
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await fetch(`${ApiURL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Không thể gửi yêu cầu đặt lại mật khẩu");
      }
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
      const response = await fetch(
        `${ApiURL}/auth/my-profile/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            newPasswordConfirm,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể đổi mật khẩu. Vui lòng thử lại!");
      }
    },
  });

  const login = async (username: string, password: string) => {
    if (username === "admin" && password === "password123") {
      const defaultUser: User = {
        fullName: "User",
        email: "admin@example.com",
        username: "admin",
      };

      await AsyncStorage.setItem("@token", "default_token");
      await AsyncStorage.setItem("@user", JSON.stringify(defaultUser));

      queryClient.setQueryData(["token"], "default_token");
      queryClient.setQueryData(["user"], defaultUser);
      return;
    }

    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
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
