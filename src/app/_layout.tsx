import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as Font from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "../styles/index.css";

Font.loadAsync({
  "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
  "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
  "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
  "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
  "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
  "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
  "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
});

SplashScreen.hideAsync();

const queryClient = new QueryClient();

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen
            name="forgot-password"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="(protected)" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export { Layout as default };
