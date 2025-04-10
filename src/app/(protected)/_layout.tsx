import { Redirect, Stack } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { ProtectedLayout } from "../../layout/ProtectedLayout";

const ProtectedLayoutWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect href='/' />;
  }

  return <ProtectedLayout>{children}</ProtectedLayout>;
};

const ProtectedRouteLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="appointments" options={{ headerShown: false }} />
      <Stack.Screen
        name="appointments-create"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="appointments-detail"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="medical-records" options={{ headerShown: false }} />
      <Stack.Screen
        name="medical-records-detail"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="notifications" options={{ headerShown: false }} />
      <Stack.Screen name="checkout" options={{ headerShown: false }} />
      <Stack.Screen name="success" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ headerShown: false }} />
      <Stack.Screen name="map" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function ProtectedRoutes() {
  return (
    <ProtectedLayoutWrapper>
      <ProtectedRouteLayout />
    </ProtectedLayoutWrapper>
  );
}
