import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const router = useRouter();
  const { user, authenticateWithGoogle } = useAuth();
  const [request, response, promptAsyncGoogle] = Google.useAuthRequest({
    webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
  });

  useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      const { authentication } = response;
      handleGoogleAuth(authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  const handleGoogleAuth = async (token: string | undefined) => {
    if (!token) return;
    try {
      await authenticateWithGoogle(token);
      router.replace("/home");
    } catch (error) {
      console.error("Error en la autenticación con Google:", error);
    }
  };

  return { promptAsyncGoogle };
};
