import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Facebook from "expo-auth-session/providers/facebook";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

WebBrowser.maybeCompleteAuthSession();

export const useFacebookAuth = () => {
  const router = useRouter();
  const { user, authenticateWithFacebook } = useAuth();
  const [request, response, promptAsyncFacebook] = Facebook.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_FACEBOOK_CLIENT_ID,
  });

  useEffect(() => {
    if (response && response.type === "success" && response.authentication) {
      const { authentication } = response;
      handleFacebookAuth(authentication.accessToken);
    }
  }, [response]);

  useEffect(() => {
    if (user) {
      router.replace("/home");
    }
  }, [user]);

  const handleFacebookAuth = async (token: string | undefined) => {
    if (!token) return;
    try {
      await authenticateWithFacebook(token);
      router.replace("/home");
    } catch (error) {
      console.error("Error en la autenticación con Facebook:", error);
    }
  };

  return { promptAsyncFacebook };
};
