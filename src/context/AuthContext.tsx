import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type Address = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type User = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  address: Address | null;
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
  token: string | null;
  googleUser: GoogleUser | null;
  facebookUser: FacebookUser | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<void>;
  authenticateWithGoogle: (token: string) => Promise<void>;
  authenticateWithFacebook: (token: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ApiURL = process.env.EXPO_PUBLIC_API_BACKEND_URL;

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: token } = useQuery<string | null>({
    queryKey: ["token"],
    queryFn: () => AsyncStorage.getItem("@token"),
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
      if (!token) return null;
      const response = await fetch(`${ApiURL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al obtener información del usuario");
      }
      return response.json();
    },
    enabled: !!token,
  });

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch(`${ApiURL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Error al iniciar sesión");
      }
      const { token: authToken } = await response.json();
      await AsyncStorage.setItem("@token", authToken);
      return authToken;
    },
    onSuccess: (authToken) => {
      queryClient.setQueryData(["token"], authToken);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      if (token) {
        await fetch(`${ApiURL}/api/users/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
      await AsyncStorage.removeItem("@user");
      await AsyncStorage.removeItem("@token");
      await AsyncStorage.removeItem("@googleUser");
      await AsyncStorage.removeItem("@facebookUser");
    },
    onSuccess: () => {
      queryClient.setQueryData(["token"], null);
      queryClient.setQueryData(["user"], null);
      queryClient.setQueryData(["googleUser"], null);
      queryClient.setQueryData(["facebookUser"], null);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({
      firstName,
      lastName,
      email,
      password,
    }: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      const response = await fetch(`${ApiURL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          role: "BUYER",
        }),
      });
      if (!response.ok) {
        throw new Error("Error al registrar");
      }
      await loginMutation.mutateAsync({ email, password });
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

      try {
        await loginMutation.mutateAsync({ email, password });
      } catch (loginError) {
        await registerMutation.mutateAsync({
          firstName: googleUserInfo.given_name,
          lastName: googleUserInfo.family_name,
          email,
          password,
        });
      }
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

      try {
        await loginMutation.mutateAsync({ email, password });
      } catch (loginError) {
        await registerMutation.mutateAsync({
          firstName: facebookUserInfo.first_name,
          lastName: facebookUserInfo.last_name,
          email,
          password,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facebookUser"] });
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const register = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    await registerMutation.mutateAsync({
      firstName,
      lastName,
      email,
      password,
    });
  };

  const authenticateWithGoogle = async (token: string) => {
    await authenticateWithGoogleMutation.mutateAsync(token);
  };

  const authenticateWithFacebook = async (token: string) => {
    await authenticateWithFacebookMutation.mutateAsync(token);
  };

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        token: token ?? null,
        googleUser: googleUser ?? null,
        facebookUser: facebookUser ?? null,
        login,
        logout,
        register,
        authenticateWithGoogle,
        authenticateWithFacebook,
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
